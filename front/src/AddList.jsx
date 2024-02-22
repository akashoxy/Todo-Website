import { useState } from 'react'
import './index.css'

function AddList() {
    const [text, setText] = useState('')
    const [date, setDate] = useState('')
    const [message, setMessage] = useState('')

    const save = async () => {
        const Qdata = {
            "text": text,
            "date": date
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Qdata)
        };
        const response = await fetch('http://localhost:3000/post', requestOptions);
        const data = await response.json();

        if (response.ok) {
            setMessage('successfully saved')

            setTimeout(()=>{
                window.location.reload()
            },2000)
           
        }
        else {
            setMessage('error')
        }

    }
    return (
        <>
            <div className="max-w-md mx-auto mt-8 bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Add Todo</h1>
                <div className="mb-6">
                    <input type="text" id="typeText" className="w-full py-2 px-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500" placeholder='Enter todo text' onChange={(e) => setText(e.target.value)} />
                </div>
                <div className="mb-6">
                    <input type="text" className="w-full py-2 px-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500" placeholder='Enter date (optional)' onChange={(e) => setDate(e.target.value)} />
                </div>
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600" onClick={save}>Save</button>
                {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
            </div>
        </>
    )
}
export default AddList