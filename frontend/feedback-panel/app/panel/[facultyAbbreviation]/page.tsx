"use server";
import { NavigationBar } from "@/components/navigationBar/page";
import { fetchFaculty } from "@/utils/fetchers/faculties";
import ProfessorCard from "@/components/professorCard/page";
import FacultyStatistics from "@/components/facultyStatistics/page";
import SearchBar from "@/components/searchBar/page";
import styles from "./page.module.css";

interface PanelPageProps {
  params: {
    facultyAbbreviation: string;
  };
  searchParams: {
    search?: string;
  };
}

export default async function PanelPage({
  params,
  searchParams,
}: PanelPageProps) {
  const facultyAbbreviation: string = params.facultyAbbreviation;
  const searchText: string = searchParams.search || "";
  const faculty = await fetchFaculty(facultyAbbreviation);
  const professors = faculty.professors;
  const filteredProfessors = searchText
    ? [
        ...professors.filter(
          (professor: any) =>
            professor.first_name
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            professor.last_name.toLowerCase().includes(searchText.toLowerCase())
        ),
      ]
    : professors;

  return (
    <>
      <NavigationBar facultyAbbreviation={faculty.abbreviation} />
      <div className={styles.pageContainer}>
        <div className={styles.statistics}>
          <FacultyStatistics statistic={6} name="Profesori" />
          <FacultyStatistics statistic={2} name="Săli" />
          <FacultyStatistics statistic={3760} name="Recenzii" />
        </div>
        <div className={styles.professorsList}>
          <SearchBar facultyAbbreviation={facultyAbbreviation} />
          {filteredProfessors && filteredProfessors.length > 0 ? (
            <>
              {filteredProfessors.map((professor: any) => (
                <ProfessorCard
                  key={professor.id}
                  professorID={professor.id}
                  firstName={professor.first_name}
                  lastName={professor.last_name}
                  gender={professor.gender}
                  facultyAbbreviation={facultyAbbreviation}
                />
              ))}
            </>
          ) : (
            <h1 className={styles.notFound}>Nu s-au găsit profesori.</h1>
          )}
        </div>
      </div>
    </>
  );
}