import styles from "./page.module.css";
import { fetchFaculty } from "@/utils/fetchers/faculties";
import {
  fetchProfessor,
  fetchProfessorAvgRating,
} from "@/utils/fetchers/professors";
import {
  SubjectWithAssociation,
  fetchSubjectsByProfessor,
} from "@/utils/fetchers/subjects";
import { NavigationBar } from "@/components/navigationBar/page";
import PolarAreaChart from "@/components/polarAreaChart/page";
import StarRating from "@/components/starRating/page";
import SubjectDropdown from "@/components/subjectDropdown/page";

interface ProfessorPageProps {
  params: {
    facultyId: number;
    professorId: number;
  };
}

export default async function ProfessorPage({ params }: ProfessorPageProps) {
  const facultyId: number = params.facultyId;
  const professorId: number = params.professorId;
  const faculty = await fetchFaculty(facultyId);
  const professor = await fetchProfessor(professorId);
  const professorAverageRating = await fetchProfessorAvgRating(professorId);
  const subjects: SubjectWithAssociation[] | false =
    await fetchSubjectsByProfessor(professorId);

  return (
    <>
      <NavigationBar facultyAbbreviation={faculty.abbreviation} />
      <div className={styles.pageContainer}>
        <h1 className={styles.professorName}>
          {professor.last_name} {professor.first_name}
        </h1>
        <PolarAreaChart
          clarity={professorAverageRating.rating_clarity_average}
          relevance={professorAverageRating.rating_relevance_average}
          interactivity={professorAverageRating.rating_interactivity_average}
          comprehension={professorAverageRating.rating_comprehension_average}
          title="Recenzii"
        />
        <StarRating
          rating={professorAverageRating.rating_overall_average}
          ratingName="Medie Recenzii"
        />
        <div className={styles.professorClasses}>
          <h1>Ore</h1>
          {subjects &&
            subjects.map((subject: any) => (
              <div key={subject.id}>
                <SubjectDropdown
                  subject={subject}
                  facultyId={facultyId}
                  professorId={professorId}
                />
              </div>
            ))}
          {subjects &&
            subjects.map((subject: any) => (
              <div key={subject.id}>
                <SubjectDropdown
                  subject={subject}
                  facultyId={facultyId}
                  professorId={professorId}
                />
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
