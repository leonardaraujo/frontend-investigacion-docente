import  { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import Select from "react-select";
import axios from "axios";
import { REVIEW_STATUS } from "../../constants/data/VariableStatus";

const RevisarTrabajoFinal = ({
  open,
  onClose,
  deliveryId,
  onReviewSuccess,
  userId,
  researchProjectId,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [comments, setComments] = useState("");
  const [maxDate, setMaxDate] = useState("");

  useEffect(() => {
    if (!open) {
      setSelectedStatus(null);
      setComments("");
      setMaxDate("");
    }
  }, [open]);

  const handleStatusChange = (selectedOption) => {
    setSelectedStatus(selectedOption);
  };

  const handleCommentsChange = (event) => {
    setComments(event.target.value);
  };

  const handleMaxDateChange = (event) => {
    setMaxDate(event.target.value);
  };

  const handleReviewSubmit = () => {
    const today = new Date().toISOString().split("T")[0];
    const reviewData = {
      delivery_id: deliveryId,
      status_review_id: selectedStatus.value,
      user_id: userId,
      comments,
      start_date: selectedStatus.value === 3 ? today : null,
      finish_date: selectedStatus.value === 3 ? maxDate : null,
      researchProjectId,
    };
    console.log(reviewData);
    axios
      .post(
        "http://localhost:3000/reviewf/update_final_delivery_status",
        reviewData,
      )
      .then((response) => {
        console.log(
          "Estado de entrega y revisión actualizados exitosamente:",
          response.data,
        );
        onReviewSuccess();
        onClose();
      })
      .catch((error) => {
        console.error(
          "Error al actualizar el estado de entrega y crear la revisión:",
          error,
        );
      });
  };

  const today = new Date().toISOString().split("T")[0];
  const maxDateLimit = new Date();
  maxDateLimit.setDate(maxDateLimit.getDate() + 3);
  const maxDateString = maxDateLimit.toISOString().split("T")[0];

  const isFormValid =
    selectedStatus &&
    (selectedStatus.value !== 3 ||
      (maxDate && maxDate >= today && maxDate <= maxDateString)) &&
    (selectedStatus.value !== 3 || comments.trim() !== "");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Revisar trabajo final</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Seleccione el estado de la revisión:
        </Typography>
        <div style={{ marginBottom: "20px" }}>
          <Select
            isSearchable={false}
            options={REVIEW_STATUS.filter((status) =>
              [2, 3].includes(status.ID),
            ).map((status) => ({
              value: status.ID,
              label: status.ESTADO,
            }))}
            value={selectedStatus}
            onChange={handleStatusChange}
            placeholder="Seleccione un estado"
          />
        </div>
        {selectedStatus?.value === 3 && (
          <>
            <Typography variant="body1" gutterBottom>
              Fecha máxima de corrección:
            </Typography>
            <TextField
              type="date"
              value={maxDate}
              onChange={handleMaxDateChange}
              inputProps={{
                min: today,
                max: maxDateString,
              }}
              variant="outlined"
              fullWidth
              style={{ marginBottom: "20px" }}
            />
          </>
        )}
        <Typography variant="body1" gutterBottom>
          Comentarios:
        </Typography>
        <TextField
          multiline
          rows={4}
          value={comments}
          onChange={handleCommentsChange}
          variant="outlined"
          fullWidth
          required={selectedStatus?.value === 3}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button
          onClick={handleReviewSubmit}
          color="secondary"
          variant="contained"
          disabled={!isFormValid}
        >
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RevisarTrabajoFinal;