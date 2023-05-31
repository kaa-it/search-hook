import "./app.css";
import { useEffect, useState } from "react";
import axios from "axios";

const useSearch = (terms) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    setError(null);
    if (terms) {
      const source = axios.CancelToken.source();
      (async () => {
        try {
          setLoading(true);
          const response = await axios.get("/search", {
            params: { terms },
            cancelToken: source.token,
          });

          setData(response.data);
          setLoading(false);
        } catch (err) {
          if (err.message === "axios request canceled") {
            return;
          }

          setError(err);
          setLoading(false);
        }
      })();
      return () => {
        source.cancel("axios request canceled");
      };
    } else {
      setData([]);
      setLoading(false);
    }
  }, [terms]);

  return { data, loading, error };
};

function App() {
  const [terms, setTerms] = useState("");

  const { data: results, loading, error } = useSearch(terms);

  return (
      <div className="app">
        <input
            className="search-input"
            placeholder="Поиск..."
            type="text"
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
        />
        {error ? (
            <div className="error">
              Что-то пошло не так:
              <div className="error-contents">{error.message}</div>
            </div>
        ) : loading ? (
            <div className="loading">Поиск...</div>
        ) : results && results.length ? (
            <table>
              <thead>
              <tr>
                <th>Город</th>
                <th>Субъект</th>
              </tr>
              </thead>
              <tbody>
              {results.map((r, index) => (
                  <tr key={index}>
                    <td>{r.name}</td>
                    <td>{r.subject}</td>
                  </tr>
              ))}
              </tbody>
            </table>
        ) : (
            <p>Нет результатов</p>
        )}
      </div>
  );
}

export default App;
