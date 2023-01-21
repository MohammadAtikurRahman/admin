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
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">Edit Beneficiary</DialogTitle>

            <DialogContent>
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
                &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="number"
                    autoComplete="off"
                    name="sl"
                    value={beneficiary.sl}
                    onChange={update}
                    placeholder="Serial"
                    required
                />
                &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="number"
                    autoComplete="off"
                    name="ben_nid"
                    value={beneficiary.ben_nid}
                    onChange={update}
                    placeholder="Beneficiary ben_nid"
                    required
                />
                &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="f_nm"
                    value={beneficiary.f_nm}
                    onChange={update}
                    placeholder="BeneFiciary Father"
                />
                <br />
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="m_nm"
                    value={beneficiary.m_nm}
                    onChange={update}
                    placeholder="BeneFiciary mother"
                />
                &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="ben_id"
                    value={beneficiary.ben_id}
                    onChange={update}
                    placeholder="BeneFiciary id"
                />
                &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="number"
                    autoComplete="off"
                    name="age"
                    value={beneficiary.age}
                    onChange={update}
                    placeholder="BeneFiciary age"
                />
                &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="dis"
                    value={beneficiary.dis}
                    onChange={update}
                    placeholder="BeneFiciary district"
                />
                <br />
                &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="sub_dis"
                    value={beneficiary.sub_dis}
                    onChange={update}
                    placeholder="BeneFiciary thana"
                />
                &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="uni"
                    value={beneficiary.uni}
                    onChange={update}
                    placeholder="BeneFiciary union"
                />
                &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="vill"
                    value={beneficiary.vill}
                    onChange={update}
                    placeholder="BeneFiciary village"
                />
                &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="relgn"
                    value={beneficiary.relgn}
                    onChange={update}
                    placeholder="BeneFiciary relgn"
                />
                <br />
                &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="job"
                    value={beneficiary.job}
                    onChange={update}
                    placeholder="BeneFiciary job"
                />
                &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="gen"
                    value={beneficiary.gen}
                    onChange={update}
                    placeholder="BeneFiciary gen"
                />
                &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="number"
                    autoComplete="off"
                    name="mob"
                    value={beneficiary.mob}
                    onChange={update}
                    placeholder="BeneFiciary mobile"
                />
                &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="pgm"
                    value={beneficiary.pgm}
                    onChange={update}
                    placeholder="BeneFiciary pgm"
                />
                <br />
                &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="number"
                    autoComplete="off"
                    name="pass"
                    value={beneficiary.pass}
                    onChange={update}
                    placeholder="BeneFiciary passbook"
                />
                &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="bank"
                    value={beneficiary.bank}
                    onChange={update}
                    placeholder="BeneFiciary bank"
                />
                &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="branch"
                    value={beneficiary.branch}
                    onChange={update}
                    placeholder="BeneFiciary branch name"
                />
                &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="r_out"
                    value={beneficiary.r_out}
                    onChange={update}
                    placeholder="BeneFiciary rout"
                />
                <br />
                &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="mob_1"
                    value={beneficiary.mob_1}
                    onChange={update}
                    placeholder="2nd mobile no"
                />
                &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="mob_own"
                    value={beneficiary.mob_own}
                    onChange={update}
                    placeholder="owner of the mobile"
                />
                &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="ben_sts"
                    value={beneficiary.ben_sts}
                    onChange={update}
                    placeholder="beneficiary sts"
                />
                &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="nid_sts"
                    value={beneficiary.nid_sts}
                    onChange={update}
                    placeholder="nid sts"
                />
                <br />
                &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="a_sts"
                    value={beneficiary.a_sts}
                    onChange={update}
                    placeholder="Approval Status "
                />
                &nbsp; &nbsp; &nbsp; &nbsp;
                {/* <TextField
                    id="standard-basic"
                    type="date"
                    label="date of birth"
                    autoComplete="off"
                    name="dob"
                    value={beneficiary.dob}
                    onChange={update}
                    placeholder="date of birth  "
                    InputLabelProps={{
                        shrink: true,
                    }}
                /> */}
                &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="date"
                    autoComplete="off"
                    label="account created"
                    name="accre"
                    value={beneficiary.accre}
                    onChange={update}
                    placeholder="account created "
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                &nbsp; &nbsp;
                <TextField
                    id="standard-basic"
                    type="date"
                    autoComplete="off"
                    label="first allow"
                    name="f_allow"
                    value={beneficiary.f_allow}
                    onChange={update}
                    placeholder=" f_allow   "
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <br />
                &nbsp;
            </DialogContent>

            <DialogActions>
                <Button onClick={handleEditModalClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={updateBeneficiary} color="primary" autoFocus>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}
