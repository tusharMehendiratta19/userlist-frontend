import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import '../style/signup.css';

const UpdatePage = (props) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [updateBox, setUpdateBox] = useState(true);
    const [gender, setGender] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [zipcode, setZipcode] = useState();
    const [interest, setInterest] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { custId } = location.state || {};
    console.log("SignupPage custId:", custId);

    useEffect(() => {
        let cancel = false;

        const fetchCustomerDetails = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/v1/users/getUserData/${custId}`,
                    { withCredentials: true }
                );
                if (cancel) return; // skip state updates if unmounted
                const user = data.user;
                setFirstName(user.firstName);
                setLastName(user.lastName);
                setEmail(user.email);
                setGender(user.gender);
                setCity(user.city);
                setState(user.state);
                setCountry(user.country);
                setZipcode(user.zipcode);
                setInterest(user.interest);
            } catch (error) {
                if (!cancel) console.error("Error fetching customer details:", error);
            }
        };

        if (custId) fetchCustomerDetails();

        return () => { cancel = true; }; // cleanup flag
    }, [custId]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/v1/users/updateUser", {
                firstName,
                lastName,
                email,
                gender,
                city,
                state,
                country,
                zipcode,
                interest
            }, { withCredentials: true });
            console.log("User created successfully:", response.data);
            navigate("/");
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    return (
        <div className="signup-container">
            <h2>Update Details</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
                <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled title="Not editable" />
                <input type="text" placeholder="Gender" value={gender} onChange={(e) => setGender(e.target.value)} required />
                <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
                <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} required />
                <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} required />
                <input type="tel" minLength={6} maxLength={6} placeholder="Zipcode" value={zipcode} onChange={(e) => setZipcode(e.target.value)} required />
                <input type="text" placeholder="Area of Interest" value={interest} onChange={(e) => setInterest(e.target.value)} required />
                <div className="actionButtons">
                    <button type="submit" className="submitData">Update</button>
                    <button className="closeBox" onClick={() => navigate("/")}>Cancel</button>
                </div>
            </form>
        </div>
    );

}

export default UpdatePage;