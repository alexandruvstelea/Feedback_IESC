from flask import Blueprint, jsonify, request
from models.ratings import Rating
from __init__ import db
from datetime import datetime
from sqlalchemy import func
from models.courses import Course
from models.subjects import Subject
from models.weeks import Week

rating_bp = Blueprint("ratings", __name__)


@rating_bp.route("/rating", methods=["POST"])
def insert_rating():
    data = request.get_json()
    date_time = datetime.strptime(data["date"], "%Y-%m-%d %H:%M:%S.%f")
    rating = int(data["rating"])
    room_id = int(data["room"])

    courses = (
        db.session.query(Course)
        .filter(Course.day == date_time.weekday(), Course.room_id == room_id)
        .all()
    )

    desired_time = date_time.time()
    filtered_courses = []
    for course in courses:
        if course.start_end[0] <= desired_time and course.start_end[1] >= desired_time:
            filtered_courses.append(course)

    if len(filtered_courses) == 1:
        try:
            new_rating = Rating(
                rating, filtered_courses[0].subject_id, room_id, date_time
            )
            db.session.add(new_rating)
            db.session.commit()
            return {"response": "New rating added to database."}
        except Exception:
            db.session.rollback()
            return {"response": f"An error has occured."}, 404
    else:
        return {"response": "An error has occured: no matching course found."}, 404


@rating_bp.route("/rating/<int:subject_id>", methods=["GET"])
def get_average_rating(subject_id):
    average_rating = (
        db.session.query(func.avg(Rating.rating))
        .filter(Rating.subject_id == subject_id)
        .scalar()
    )

    return jsonify({"response": round(average_rating, 2)})


@rating_bp.route("/ratingsnumber/<int:subject_id>", methods=["GET"])
def get_ratings(subject_id):
    ratings = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    rating_counts = (
        db.session.query(Rating.rating, func.count(Rating.rating))
        .group_by(Rating.rating)
        .all()
    )

    for rating, count in rating_counts:
        ratings[rating] = count

    ratings_dict = {f"{key}_rating": value for key, value in ratings.items()}

    return jsonify(ratings_dict)


@rating_bp.route("/graph", methods=["GET"])
def get_graph_data():
    subject_id = request.args.get("subject_id")
    if subject_id:
        subject = db.session.query(Subject).filter(Subject.id == subject_id).first()
        ratings = db.session.query(Rating).filter_by(subject_id=subject_id).all()
        if subject:
            weeks = db.session.query(Week).filter_by(semester=subject.semester).all()

        if ratings and weeks:
            week_ratings = {}
            for week in weeks:
                week_ratings[f"week_{week.id}"] = []
                for rating in ratings:
                    if week.start <= rating.datetime.date() <= week.end:
                        week_ratings[f"week_{week.id}"].append(rating.rating)

                if week_ratings[f"week_{week.id}"]:
                    week_ratings[f"week_{week.id}"] = round(
                        sum(week_ratings[f"week_{week.id}"])
                        / len(week_ratings[f"week_{week.id}"]),
                        2,
                    )
                else:
                    week_ratings[f"week_{week.id}"] = 0

            return jsonify(week_ratings)
        else:
            return {"response": "An error has occured. 1"}
    else:
        return {"response": "An error has occured. 2"}
