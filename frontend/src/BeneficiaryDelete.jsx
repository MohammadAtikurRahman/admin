import React, { useState } from "react";
import axios from "axios";
import swal from 'sweetalert2';
import Swal from 'sweetalert2';

import {
  Button,

} from "@material-ui/core";

const baseUrl = process.env.REACT_APP_URL;
function BeneficiaryDelete({ row }) {
  const [status, setStatus] = useState("");
  const handleDelete = async () => {
    swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then(async (result) => {
      if (result.value) {
          try {
            const response = await axios.delete(baseUrl + `/beneficiary/${row.beneficiaryId}`);
            window.location.reload();
            setTimeout(function() {
              swal.fire(
                'Error!',
                'Error deleting beneficiary.',
                'error'
              )
            }, 5000);
            
          } catch (error) {
            swal.fire(
              'Error!',
              'Error deleting beneficiary.',
              'error',
              

            )
          }
      } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
      ) {
    
      }
    });
  }
  return (
    <>

      <Button
        className="button_style"
        variant="outlined"
        color="secondary"
        size="small"

        style={{

          width: "100px",

        }}

        onClick={handleDelete}
      >
        Delete
      </Button>


      <p>{status}</p>
    </>
  );
}

export default BeneficiaryDelete;
