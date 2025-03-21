import { Button, Typography, TableCell, TableRow } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const ObservationItem = ({ entrega, getObservationStatus }) => {
  return (
    <TableRow key={entrega.id}>
      <TableCell>
        <Button
          variant="contained"
          color="primary"
          style={{ display: "block", marginTop: "5px" }}
          disabled={
            entrega.review?.status_review_id !== 3 ||
            !entrega.review?.observation?.doc_file_route_id ||
            entrega.review?.observation?.status_observation_id !== 1
          }
        >
          Gestionar observacion
        </Button>
        {entrega.review?.observation ? (
          <>
            {entrega.review.observation.doc_file_route_id ? (
              <Button
                href={`localhost:3000/download/download-pdf/${entrega.review.observation.doc_file_route_id}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                style={{ display: "block", marginTop: "5px" }}
              >
                {entrega?.review?.observation?.doc_file_route?.path
                  .split("\\")
                  .pop()
                  .split("/")
                  .pop()}
              </Button>
            ) : (
              <p>No hay archivo</p>
            )}
            <div style={{ marginTop: "10px" }}>
              <Typography variant="body2" color="textSecondary">
                Estado de observación:{" "}
                {getObservationStatus(entrega.review.observation.status_observation_id)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Comentarios: {entrega.review.observation.comments}
              </Typography>
            </div>
          </>
        ) : (
          <p>No hay archivo</p>
        )}
      </TableCell>
    </TableRow>
  );
};

export default ObservationItem;