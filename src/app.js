import './app.css';
import {useEffect, useState} from "react";
import axios from "axios";

function App() {
    const [terms, setTerms] = useState('');

    const [results, setResults] = useState([]);

    useEffect(() => {
        if (terms) {
            axios.get("/search", {
                params: {terms},
            })
                .then(res => setResults(res.data))
                .catch(err => console.log(err));
        }
    }, [terms]);

    return (
        <div className="app">
            <input
                className="search-input"
                placeholder="Поиск..."
                type="text"
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
            />
            {results && results.length ? (
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
