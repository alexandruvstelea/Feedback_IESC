import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Subject, Programme, Session, Professor } from "@/utils/types";
import {
  weekTypeMapping,
  dayMapping,
  sessionTypeMapping,
  semesterOptions,
} from "@/utils/functions";
const SubjectForm: React.FC<{
  isEditMode: boolean;
  subject?: Subject | null;
  programmes: Programme[];
  sessions: Session[];
  professors: Professor[];
  onClose: () => void;
  onSubmit: () => void;
}> = ({
  isEditMode,
  subject,
  programmes,
  sessions,
  professors,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState(subject?.name || "");
  const [abbreviation, setAbbreviation] = useState(subject?.abbreviation || "");
  const [semester, setSemester] = useState(subject?.semester || "");
  const [courseProfessor, setCourseProfessor] = useState<number | null>(null);
  const [laboratoryProfessor, setLaboratoryProfessor] = useState<number | null>(
    null
  );
  const [seminarProfessor, setSeminarProfessor] = useState<number | null>(null);
  const [projectProfessor, setProjectProfessor] = useState<number | null>(null);
  const [selectedProgrammes, setSelectedProgrammes] = useState<number[]>([]);
  const [selectedSessions, setSelectedSessions] = useState<number[]>([]);

  useEffect(() => {
    if (subject) {
      setCourseProfessor(subject.course_professor_id || null);
      setLaboratoryProfessor(subject.laboratory_professor_id || null);
      setSeminarProfessor(subject.seminar_professor_id || null);
      setProjectProfessor(subject.project_professor_id || null);
      setSelectedProgrammes(
        subject.programmes.map((programme) => programme.id)
      );
      setSelectedSessions(subject.sessions.map((session) => session.id));
    }
  }, [subject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      abbreviation,
      semester,
      course_professor_id: courseProfessor,
      laboratory_professor_id: laboratoryProfessor,
      seminar_professor_id: seminarProfessor,
      project_professor_id: projectProfessor,
      programmes: selectedProgrammes.map(String),
      sessions: selectedSessions.map(String),
    };
    console.log(payload);
    try {
      const url = isEditMode
        ? `${process.env.API_URL}/subjects/${subject?.id}`
        : `${process.env.API_URL}/subjects`;
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok)
        throw new Error(
          isEditMode ? "Failed to edit subject" : "Failed to add subject"
        );

      onSubmit();
      onClose();
    } catch (error) {
      console.error("Error submitting subject:", error);
    }
  };

  const programmeOptions = programmes.map((programme) => ({
    value: programme.id,
    label: `${programme.name} (${programme.abbreviation})`,
  }));

  const sessionOptions = sessions.map((session) => ({
    value: session.id,
    label: `${session.start.slice(0, 5)} - ${session.end.slice(0, 5)} - ${
      sessionTypeMapping[session.type]
    } - Sem: ${session.semester} - ${weekTypeMapping[session.week_type]} - ${
      dayMapping[session.day]
    }`,
  }));

  const professorOptions = professors.map((professor) => ({
    value: professor.id,
    label: `${professor.first_name} ${professor.last_name}`,
  }));

  return (
    <div className="fixed z-50 inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg max-w-xl w-full">
        <h3 className="text-lg font-semibold mb-2">
          {isEditMode ? "Editează materie" : "Adaugă materie"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Nume</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Abreviere</label>
            <input
              type="text"
              value={abbreviation}
              onChange={(e) => setAbbreviation(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Semestru</label>
            <Select
              options={semesterOptions}
              value={semesterOptions.find(
                (option) => option.value === semester
              )}
              onChange={(selectedOption) =>
                setSemester(selectedOption?.value || "")
              }
              isSearchable={false}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Profesor Curs</label>
            <Select
              options={professorOptions}
              value={professorOptions.find(
                (option) => option.value === courseProfessor
              )}
              onChange={(selectedOption) =>
                setCourseProfessor(selectedOption?.value || null)
              }
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Profesor Laborator</label>
            <Select
              options={professorOptions}
              value={professorOptions.find(
                (option) => option.value === laboratoryProfessor
              )}
              onChange={(selectedOption) =>
                setLaboratoryProfessor(selectedOption?.value || null)
              }
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Profesor Seminar</label>
            <Select
              options={professorOptions}
              value={professorOptions.find(
                (option) => option.value === seminarProfessor
              )}
              onChange={(selectedOption) =>
                setSeminarProfessor(selectedOption?.value || null)
              }
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Profesor Proiect</label>
            <Select
              options={professorOptions}
              value={professorOptions.find(
                (option) => option.value === projectProfessor
              )}
              onChange={(selectedOption) =>
                setProjectProfessor(selectedOption?.value || null)
              }
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Specializări</label>
            <Select
              options={programmeOptions}
              isMulti
              value={programmeOptions.filter((option) =>
                selectedProgrammes.includes(option.value)
              )}
              isSearchable
              onChange={(selectedOptions) =>
                setSelectedProgrammes(
                  selectedOptions.map(
                    (option: { value: number }) => option.value
                  )
                )
              }
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Sesiuni</label>
            <Select
              options={sessionOptions}
              isMulti
              value={sessionOptions.filter((option) =>
                selectedSessions.includes(option.value)
              )}
              isSearchable
              onChange={(selectedOptions) =>
                setSelectedSessions(
                  selectedOptions.map(
                    (option: { value: number }) => option.value
                  )
                )
              }
              className="w-full"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Închide
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {isEditMode ? "Editează" : "Adaugă"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectForm;