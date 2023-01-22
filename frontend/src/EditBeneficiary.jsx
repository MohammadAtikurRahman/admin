import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
} from "@material-ui/core";
import { useState } from "react";
import swal from "sweetalert";
import moment from "moment";

const axios = require("axios");
const baseUrl = process.env.REACT_APP_URL;

export function EditBeneficiary(props) {
    const { isEditModalOpen, handleEditModalClose, getBeneficiaries } = props;
    const [beneficiary, setBeneficiary] = useState(props.beneficiary);

    async function updateBeneficiary() {
        console.log(beneficiary);

        /*
        axios
            .patch(baseUrl + "beneficiary/" + beneficiary._id, { beneficiary })
            .then((res) => {
                       })
            .catch((err) => {
                           });
            */

        const res = await axios.patch("http://localhost:2000/beneficiary/" + beneficiary._id, {
            beneficiary: beneficiary,
        });

        if (res.status === 200) {
            handleEditModalClose();
            swal({
                text: res.data.title,
                icon: "success",
                type: "success",
            });
            getBeneficiaries();
        } else {
            swal({
                text: res?.data?.errorMessage,
                icon: "error",
                type: "error",
            });
        }
    }

    function update(event) {
        let { name, value } = event.target;

        if (value === null) {
            value = "";
        }

        setBeneficiary((beneficiary) => {
            return { ...beneficiary, [name]: value };
        });
    }
    return (
        <Dialog
            open={isEditModalOpen}
            onClose={handleEditModalClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="xl">
            <DialogContent style={{ padding: "90px" }}>
                <DialogTitle id="alert-dialog-title">Edit Beneficiary</DialogTitle>
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="beneficiaryId"
                    value={beneficiary.beneficiaryId}
                    onChange={update}
                    placeholder="Beneficiary Id"
                    required
                    fullWidth
                />
                <br />
                <br />
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="name"
                    value={beneficiary.name}
                    onChange={update}
                    placeholder="Beneficiary Name"
                    required
                />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="u_nm"
                    value={beneficiary.u_nm}
                    onChange={update}
                    placeholder="Beneficiary's Husband/Wife names  "
                />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="f_nm"
                    value={beneficiary.f_nm}
                    onChange={update}
                    placeholder="Beneficiary Father"
                />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="m_nm"
                    value={beneficiary.m_nm}
                    onChange={update}
                    placeholder="Beneficiary Mother"
                />
                <br />
                <br />
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="dis"
                    value={beneficiary.dis}
                    onChange={update}
                    placeholder="Beneficiary District"
                />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="sub_dis"
                    value={beneficiary.sub_dis}
                    onChange={update}
                    placeholder="Beneficiary Thana"
                />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="uni"
                    value={beneficiary.uni}
                    onChange={update}
                    placeholder="Benefciary Union"
                />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="sl"
                    value={beneficiary.sl}
                    onChange={update}
                    placeholder="Beneficiary Ward No"
                />
                <br />
                <br />
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="vill"
                    value={beneficiary.vill}
                    onChange={update}
                    placeholder="Beneficiary Village"
                />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="bank"
                    value={beneficiary.bank}
                    onChange={update}
                    placeholder="Beneficiary Bank"
                />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="job"
                    value={beneficiary.job}
                    onChange={update}
                    placeholder="Beneficiary Job"
                />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="number"
                    autoComplete="off"
                    name="ben_nid"
                    value={beneficiary.ben_nid}
                    onChange={update}
                    placeholder="Beneficiary NID"
                    required
                />
                <br />
                <br />
                <TextField
                    id="standard-basic"
                    type="number"
                    autoComplete="off"
                    name="mob"
                    value={beneficiary.mob}
                    onChange={update}
                    placeholder="Beneficiary Mobile"
                />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="r_out"
                    value={beneficiary.r_out}
                    onChange={update}
                    placeholder="Beneficiary Rout"
                />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="mob_own"
                    value={beneficiary.mob_own}
                    onChange={update}
                    placeholder="Beneficiary Mobile Owner"
                />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="branch"
                    value={beneficiary.branch}
                    onChange={update}
                    placeholder="Beneficiary Bank Branch "
                />
                <br />
                <br />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <select
                    id="standard-basic"
                    name="gen"
                    value={beneficiary.gen}
                    onChange={update}
                    style={{
                        border: "none",
                        padding: "8px",
                        color: "grey",
                        background: "white",
                    }}>
                    <option value="" disabled>
                        Select Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <select
                    id="standard-basic"
                    name="a_sts"
                    value={beneficiary.a_sts}
                    onChange={update}
                    style={{
                        border: "none",
                        padding: "8px",
                        color: "grey",
                        background: "white",
                    }}>
                    <option value="" disabled>
                        Approval Status
                    </option>
                    <option value="Approved">Approved</option>
                    <option value="Not Approved">Not Approvved</option>
                </select>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <select
                    id="standard-basic"
                    name="age"
                    value={beneficiary.age}
                    onChange={update}
                    style={{
                        border: "none",
                        padding: "8px",
                        color: "grey",
                        background: "white",
                    }}>
                    <option value="" disabled>
                        Beneficiary Age
                    </option>
                    <option value="">Age</option>
                    <option value="41">41</option>
                    <option value="42">42</option>
                    <option value="43">43</option>
                    <option value="44">44</option>
                    <option value="45">45</option>
                    <option value="46">46</option>
                    <option value="47">47</option>
                    <option value="48">48</option>
                    <option value="49">49</option>
                    <option value="50">50</option>
                    <option value="51">51</option>
                    <option value="52">52</option>
                    <option value="53">53</option>
                    <option value="54">54</option>
                    <option value="55">55</option>
                    <option value="56">56</option>
                    <option value="57">57</option>
                    <option value="58">58</option>
                    <option value="59">59</option>
                    <option value="60">60</option>
                </select>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <select
                    id="standard-basic"
                    name="relgn"
                    value={beneficiary.relgn}
                    onChange={update}
                    style={{
                        border: "none",
                        padding: "8px",
                        color: "grey",
                        background: "white",
                    }}>
                    <option value="" disabled>
                        Beneficiary Religion
                    </option>
                    <option value="Islam">Islam</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Other">Other</option>
                </select>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <br />
                <br />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="date"
                    label="Date of Birth"
                    autoComplete="off"
                    name="dob"
                    value={beneficiary.dob}
                    onChange={update}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        style: { color: "grey" },
                    }}
                    placeholder="date of birth  "
                    format="dd/mm/yyyy"
                />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="date"
                    autoComplete="off"
                    label="Account Created"
                    name="accre"
                    value={beneficiary.accre}
                    onChange={update}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        style: { color: "grey" },
                    }}
                    placeholder="Account created "
                />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <TextField
                    id="date-picker-dialog"
                    type="date"
                    autoComplete="off"
                    label="First Allowance"
                    format="dd/MM/yyyy"
                    name="f_allow"
                    value={beneficiary.f_allow}
                    onChange={update}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        style: { color: "grey" },
                    }}
                    placeholder=" f_allow   "
                />
                <br />
                &nbsp;
            </DialogContent>

            <DialogActions style={{ paddingRight: "80px", paddingBottom: "50px" }}>
                <Button
                    onClick={handleEditModalClose}
                    color="primary"
                    style={{ backgroundColor: "#FF0063", color: "white" }}>
                    Cancel
                </Button>
                <Button
                    onClick={updateBeneficiary}
                    color="primary"
                    autoFocus
                    style={{ backgroundColor: "#3D1766", color: "white" }}>
                    Updated Beneficiary
                </Button>
            </DialogActions>
        </Dialog>
    );
}
