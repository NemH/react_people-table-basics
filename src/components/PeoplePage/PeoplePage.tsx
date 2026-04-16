import React, { useEffect, useState } from 'react';
import { Person } from '../../types';
import { Loader } from '../Loader';
import { Link, useParams } from 'react-router-dom';
import { getPeople } from '../../api';

type PersonLinkProps = { people: Person; onSelect: (name: string) => void };
const PersonLink: React.FC<PersonLinkProps> = ({ people, onSelect }) => (
  <Link
    to={`/people/${people.slug}`}
    onClick={() => onSelect(people.name)}
    className={people.sex === 'f' ? 'has-text-danger' : ''}
  >
    {people.name}
  </Link>
);

export const PeoplePage = () => {
  const [selectedPersonName, setSelectedPersonName] = useState<string>('');
  const [loader, setLoader] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [peoples, setPeoples] = useState<Person[]>([]);

  const { slug } = useParams();

  function peopleByName(name: string) {
    return peoples.find(person => person.name === name);
  }

  useEffect(() => {
    async function fetchData() {
      setError(null);

      try {
        setLoader(true);
        const peoplesData = await getPeople();

        setPeoples(peoplesData);
      } catch {
        setError('Something went wrong. Please try again later.');
      } finally {
        setLoader(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!slug || peoples.length === 0) {
      return;
    }

    const person = peoples.find(p => p.slug === slug);

    if (person) {
      setSelectedPersonName(person.name);
    } else {
      setSelectedPersonName('');
    }
  }, [slug, peoples]);

  const hasPeople = peoples.length > 0;

  return (
    <>
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="box table-container">
          {loader && <Loader />}

          {hasPeople && (
            <table
              data-cy="peopleTable"
              className="table is-striped is-hoverable is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sex</th>
                  <th>Born</th>
                  <th>Died</th>
                  <th>Mother</th>
                  <th>Father</th>
                </tr>
              </thead>

              <tbody>
                {peoples.map(people => {
                  const mother = people.motherName
                    ? peopleByName(people.motherName)
                    : null;
                  const father = people.fatherName
                    ? peopleByName(people.fatherName)
                    : null;

                  return (
                    <tr
                      data-cy="person"
                      key={people.slug}
                      className={
                        selectedPersonName === people.name
                          ? 'has-background-warning'
                          : ''
                      }
                    >
                      <td>
                        <Link
                          to={`/people/${people.slug}`}
                          onClick={() => setSelectedPersonName(people.name)}
                          className={
                            people.sex === 'f' ? 'has-text-danger' : ''
                          }
                        >
                          {people.name}
                        </Link>
                      </td>
                      <td>{people.sex}</td>
                      <td>{people.born}</td>
                      <td>{people.died}</td>
                      <td>
                        {mother ? (
                          <PersonLink
                            people={mother}
                            onSelect={setSelectedPersonName}
                          />
                        ) : (
                          people.motherName || '-'
                        )}
                      </td>
                      <td>
                        {father ? (
                          <PersonLink
                            people={father}
                            onSelect={setSelectedPersonName}
                          />
                        ) : (
                          people.fatherName || '-'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {!loader && !error && !hasPeople && (
            <p data-cy="noPeopleMessage">There are no people on the server</p>
          )}
        </div>

        {error && (
          <p data-cy="peopleLoadingError" className="has-text-danger">
            Something went wrong
          </p>
        )}
      </div>
    </>
  );
};
