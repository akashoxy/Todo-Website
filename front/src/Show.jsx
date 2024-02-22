import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Show() {
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [message, setMessage] = useState('');
    const [text, setText] = useState('');
    const [date, setDate] = useState('');
    const [idToEdit, setIdToEdit] = useState(null);
    const closeModal = () => {
        setOpenModal(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/getAll');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error
            }
        };
        fetchData();
    }, []);

    const deleteItem = async (id) => {
        try {
            const requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            };
            const response = await fetch(`http://localhost:3000/delete/${id}`, requestOptions);

            if (response.ok) {
                alert('Item deleted successfully');
            } else {
                alert('Error deleting item');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    }

    const editItem = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/getOne/${id}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Received data:', data); // Log the data
            setText(data.text);
            setDate(data.date);
            setIdToEdit(id);
            setOpenModal(true);
        } catch (error) {
            console.error('Error fetching data:', error);
            setMessage('Error fetching data. Please try again.');
        }
    }

    const save = async () => {
        const Qdata = {
            "text": text,
            "date": date
        }
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Qdata)
        };
        const response = await fetch(`http://localhost:3000/update/${idToEdit}`, requestOptions);
        const data = await response.json();

        if (response.ok) {
            setMessage('successfully saved')
            navigate("/")
            window.location.reload()
        }
        else {
            setMessage('error')
        }
    }

    // Logic for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <div className="max-w-4xl mx-auto mt-8">
                <h1 className="text-3xl font-bold mb-4">Todo List</h1>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">ToDo</th>
                                <th className="px-4 py-2" colSpan={2}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item) => (
                                <tr key={item._id}>
                                    <td className="border px-4 py-2">{item.date}</td>
                                    <td className="border px-4 py-2">{item.text}</td>
                                    <td className="border px-4 py-2">
                                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" type="button" onClick={() => editItem(item._id)}>Edit</button>
                                    </td>
                                    <td className="border px-4 py-2">
                                        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" type="button" onClick={() => deleteItem(item._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                {items.length > itemsPerPage && (
                    <div className="mt-4">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="mr-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Prev
                        </button>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={indexOfLastItem >= items.length}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default Show;
