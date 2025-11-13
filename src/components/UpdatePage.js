import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import '../style/signup.css';

const UpdatePage = (props) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [gender, setGender] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [interest, setInterest] = useState([]);

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [allLocations, setAllLocations] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    const { custId } = location.state || {};
    // Fetch location data
    useEffect(() => {
        async function getLocation() {
            try {
                const response = await axios.get("http://localhost:5000/v1/users/locations");
                const locationData = response.data.locations || [];
                setAllLocations(locationData);

                // Populate country dropdown
                const countryList = locationData.map((loc) => loc.country);
                setCountries(countryList);
            } catch (err) {
                console.error("Error fetching locations:", err);
            }
        }
        getLocation();
    }, []);

    // Handle country change
    const handleCountryChange = (e) => {
        const selectedCountry = e.target.value;
        setCountry(selectedCountry);
        setState("");
        setCity("");
        setCities([]);

        const countryData = allLocations.find((c) => c.country === selectedCountry);
        if (countryData) {
            const stateList = countryData.states.map((s) => s.name);
            setStates(stateList);
        } else {
            setStates([]);
        }
    };

    // Handle state change
    const handleStateChange = (e) => {
        const selectedState = e.target.value;
        setState(selectedState);
        setCity("");

        const countryData = allLocations.find((c) => c.country === country);
        const stateData = countryData?.states.find((s) => s.name === selectedState);
        if (stateData) {
            setCities(stateData.cities);
        } else {
            setCities([]);
        }
    };


    const interestOptions = ["technology", "sports", "music", "art", "science", "travel", "cooking"];

    const toggleInterest = (val) => {
        if (!Array.isArray(interest)) {
            setInterest([val]);
            return;
        }
        if (interest.includes(val)) {
            setInterest(interest.filter((i) => i !== val));
        } else {
            setInterest([...interest, val]);
        }
    };

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
            navigate("/");
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    // After fetching both user and location data, auto-populate state/city lists
    useEffect(() => {
        if (allLocations.length > 0 && country) {
            const countryData = allLocations.find((c) => c.country === country);
            if (countryData) {
                const stateList = countryData.states.map((s) => s.name);
                setStates(stateList);

                const stateData = countryData.states.find((s) => s.name === state);
                if (stateData) {
                    setCities(stateData.cities);
                }
            }
        }
    }, [allLocations, country, state]);

    return (
        <div className="signup-container">
            <h2>Update Details</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
                <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                {/* Gender dropdown */}
                <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>

                {/* Country dropdown */}
                <select value={country} onChange={handleCountryChange} required>
                    <option value="">Select Country</option>
                    {countries.map((c, idx) => (
                        <option key={idx} value={c}>
                            {c}
                        </option>
                    ))}
                </select>

                {/* State dropdown */}
                <select value={state} onChange={handleStateChange} disabled={!country} required>
                    <option value="">Select State</option>
                    {states.map((s, idx) => (
                        <option key={idx} value={s}>
                            {s}
                        </option>
                    ))}
                </select>

                {/* City dropdown */}
                <select value={city} onChange={(e) => setCity(e.target.value)} disabled={!state} required>
                    <option value="">Select City</option>
                    {cities.map((city, idx) => (
                        <option key={idx} value={city}>
                            {city}
                        </option>
                    ))}
                </select>

                <input type="tel" minLength={6} maxLength={6} placeholder="Zipcode" value={zipcode} onChange={(e) => setZipcode(e.target.value)} required />

                {/* Area of Interest */}
                <div className="interest-group" role="group" aria-label="Area of Interest">
                    <label className="interest-title">Area of Interest:</label>
                    <div className="interest-options">
                        {interestOptions.map((opt) => (
                            <label key={opt} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    value={opt}
                                    checked={Array.isArray(interest) && interest.includes(opt)}
                                    onChange={() => toggleInterest(opt)}
                                />
                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="actionButtons">
                    <button type="submit" className="submitData">
                        Update
                    </button>
                    <button type="button" className="closeBox" onClick={() => navigate("/")}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );

}

export default UpdatePage;