import { useState, useEffect } from 'react';

function App() {
    const [data, setData] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data2, setData2] = useState('');
    const [loading2, setLoading2] = useState(true);
    const [error2, setError2] = useState('');

    useEffect(() => {
        fetch('/test')
            .then((res) => res.text())
            .then((data) => setData(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
        fetch('/cookie')
            .then((res) => res.text())
            .then((data) => setData2(data))
            .catch((err) => setError2(err.message))
            .finally(() => setLoading2(false));
    }, []);

    if (loading || loading2) {
        return <div>Loading...</div>;
    }

    if (error || error2) {
        return (
            <div>
                1: {error}, 2: {error2}
            </div>
        );
    }

    return (
        <pre className='App'>
            1: {data}, 2: {data2}
        </pre>
    );
}

export default App;
