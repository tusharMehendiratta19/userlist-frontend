import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/signup.css";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import constants from "../constants";
import Snackbar from "./Snackbar";
import { locationsList, createUser } from "../api/userApi";

const SignupPage = () => {
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
    const { name, userId } = useSelector((state) => state.user);
    const [snack, setSnack] = useState({ open: false, message: "", type: "" });

    const showSnack = (msg, type) => {
        setSnack({ open: true, message: msg, type });
        setTimeout(() => setSnack({ open: false, message: "", type: "" }), 3000);
    };

    const navigate = useNavigate();
    const dispatch = useDispatch();
    // Fetch location data
    useEffect(() => {
        async function getLocation() {
            try {
                const response = await locationsList();
                console.log("Locations response:", response.data);

                const countriesData = response.data?.countries || [];

                setAllLocations(countriesData);

                // Populate Country dropdown
                setCountries(countriesData.map((c) => ({ id: c.id, name: c.name })));

            } catch (err) {
                console.error("Error fetching locations:", err);
            }
        }

        getLocation();
    }, []);


    const handleCountryChange = (e) => {
        const selectedCountryId = Number(e.target.value);

        setCountry(selectedCountryId);
        setState("");
        setCity("");

        const countryObj = allLocations.find((c) => c.id === selectedCountryId);

        if (countryObj) {
            setStates(countryObj.states.map((s) => ({ id: s.id, name: s.name })));
        } else {
            setStates([]);
        }

        setCities([]);
    };

    const handleStateChange = (e) => {
        const selectedStateId = Number(e.target.value);

        setState(selectedStateId);
        setCity("");

        const countryObj = allLocations.find((c) => c.id === country);

        const stateObj = countryObj?.states.find((s) => s.id === selectedStateId);

        if (stateObj) {
            setCities(stateObj.cities.map((city) => ({ id: city.id, name: city.name })));
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

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (password !== confirmPassword) {
    //         alert(constants.password_mismatch);
    //         return;
    //     }
    //     try {
    //         const response = await createUser({
    //             firstName,
    //             lastName,
    //             email,
    //             password,
    //             gender,
    //             city,
    //             state,
    //             country,
    //             zipcode,
    //             interest,
    //         });

    //         if (response.status === 201) {
    //             if (userId === null) {
    //                 dispatch(setUserData({
    //                     userId: response.data.userId,
    //                     name: response.data.name
    //                 }));
    //             }
    //             showSnack(constants.signup_success, constants.success);
    //             setTimeout(() => navigate("/"), 1000);
    //         } else if (response.status === 400) {
    //             showSnack(response.data.message, constants.error);
    //         } else {
    //             showSnack(constants.signup_failed, constants.error);
    //         }
    //     } catch (error) {
    //         console.error("Error creating user:", error);
    //     }
    // };

    const handleCancel = () => {
        userId === null ? navigate("/login") : navigate("/");
    }

    const [profileFile, setProfileFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (!profileFile) {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(profileFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [profileFile]);

    const customSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert(constants.password_mismatch);
            return;
        }
        try {
            // Build multipart form data so we can include an image
            const formData = new FormData();
            formData.append("firstName", firstName);
            formData.append("lastName", lastName);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("gender", gender);
            formData.append("city", city);
            formData.append("state", state);
            formData.append("country", country);
            formData.append("zipcode", zipcode);
            formData.append("interest", JSON.stringify(interest || [])); // send as JSON string
            if (profileFile) {
                formData.append("profileImage", profileFile);
            }

            // createUser should accept FormData and send multipart/form-data
            const response = await createUser(formData);

            if (response.status === 201) {
                if (userId === null) {
                    dispatch(
                        setUserData({
                            userId: response.data.userId,
                            name: response.data.name,
                        })
                    );
                }
                showSnack(constants.signup_success, constants.success);
                setTimeout(() => navigate("/"), 1000);
            } else if (response.status === 400) {
                showSnack(response.data.message, constants.error);
            } else {
                showSnack(constants.signup_failed, constants.error);
            }
        } catch (error) {
            console.error("Error creating user:", error);
            showSnack(constants.signup_failed, constants.error);
        }
    };

    return (
        <div>
            <div className="signup-container">
                <h2>Signup Page</h2>
                <form className="signup-form" onSubmit={customSubmit} encType="multipart/form-data">
                    <div className="subdiv subdiv1">
                        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                    <div className="subdiv subdiv2">
                        <select value={country} onChange={handleCountryChange}>
                            <option value="">Select Country</option>
                            {countries.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>


                        <select value={state} onChange={handleStateChange}>
                            <option value="">Select State</option>
                            {states.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>


                        <select value={city} onChange={(e) => setCity(Number(e.target.value))}>
                            <option value="">Select City</option>
                            {cities.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="subdiv subdiv3">
                        <input type="tel" minLength={6} maxLength={6} placeholder="Zipcode" value={zipcode} onChange={(e) => setZipcode(e.target.value)} required />

                        <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="interest-group" role="group" aria-label="Area of Interest">
                        <span className="interest-title">Area of Interest:</span>
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

                    <div className="subdiv  subdiv4">
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>

                    {/* Profile image input */}
                    <label className="file-label">
                        <p>Profile Picture (optional):</p>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setProfileFile(e.target.files && e.target.files[0])}
                        />
                    </label>
                    {previewUrl && (
                        <div className="preview">
                            <img src={previewUrl} alt="Preview" style={{ maxWidth: "100px", maxHeight: "100px" }} />
                        </div>
                    )}

                    <div className="actionButtons">
                        <button type="submit" className="submitData">
                            Sign Up
                        </button>
                        <button type="button" className="closeBox" onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </form>
                <p>
                    Already a User? login <span onClick={() => navigate("/login")}>here</span>
                </p>
            </div>
            <Snackbar open={snack.open} message={snack.message} type={snack.type} />
        </div>
    );
};

export default SignupPage;
