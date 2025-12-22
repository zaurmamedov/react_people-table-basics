import { useEffect, useState } from 'react';
import { Loader } from '../components/Loader';
import { Person } from '../types';
import { getPeople } from '../api';
import { Link, useParams } from 'react-router-dom';

export const PeoplePage = () => {
  const { personName } = useParams();
  const [people, setPeople] = useState<Person[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const peopleWithRelations = people.map(person => ({
    ...person,
    mother: people.find(p => p.name === person.motherName),
    father: people.find(p => p.name === person.fatherName),
  }));

  useEffect(() => {
    setLoading(true);
    setErrorMessage('');

    getPeople()
      .then(setPeople)
      .catch(() => setErrorMessage('There are no people on the server'))
      .finally(() => setLoading(false));
  }, []);

  function getPersonSlug(name: string) {
    return name.trim().toLowerCase().replace(/\s+/g, '-');
  }

  function getPersonId(person: Person) {
    return `${getPersonSlug(person.name)}-${person.born}`;
  }

  const activePersonId = personName;

  function isActivePerson(person: Person) {
    return getPersonId(person) === activePersonId;
  }

  return (
    <>
      <h1 className="title">People Page</h1>
      <div className="block">
        <div className="box table-container">
          {loading && <Loader />}

          {!loading && errorMessage && (
            <p data-cy="peopleLoadingError" className="has-text-danger">
              Something went wrong
            </p>
          )}

          {!loading && !errorMessage && people.length === 0 && (
            <p data-cy="noPeopleMessage">There are no people on the server</p>
          )}

          {!loading && !errorMessage && people.length > 0 && (
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
                {peopleWithRelations.map(person => (
                  <tr
                    data-cy="person"
                    key={person.name}
                    className={
                      isActivePerson(person) ? 'has-background-warning' : ''
                    }
                  >
                    <>
                      <td>
                        <Link
                          to={`/people/${getPersonId(person)}`}
                          className={
                            person.sex === 'f' ? 'has-text-danger' : ''
                          }
                        >
                          {person.name}
                        </Link>
                      </td>
                      <td>{person.sex}</td>
                      <td>{person.born}</td>
                      <td>{person.died}</td>
                      <td>
                        {person.mother ? (
                          <Link
                            to={`/people/${getPersonId(person.mother)}`}
                            className="has-text-danger"
                          >
                            {person.mother.name}
                          </Link>
                        ) : (
                          person.motherName || '-'
                        )}
                      </td>

                      <td>
                        {person.father ? (
                          <Link to={`/people/${getPersonId(person.father)}`}>
                            {person.father.name}
                          </Link>
                        ) : (
                          person.fatherName || '-'
                        )}
                      </td>
                    </>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};
