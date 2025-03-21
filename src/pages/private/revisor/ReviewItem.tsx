
import { Button, Typography, TableCell, TableRow } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const ReviewItem = ({ entrega, handleOpenReviewPopUp, getReviewStatus }) => {
  return (
    <TableRow key={entrega.id}>
      <TableCell>{entrega.delivery_number}</TableCell>
      <TableCell>
        <Button
          variant="contained"
          color="primary"
          style={{ display: "block", marginTop: "5px" }}
          disabled={!entrega.doc_file_route_id || entrega.review_id}
          onClick={() => handleOpenReviewPopUp(entrega.id)}
        >
          Revisar
        </Button>
        {entrega.doc_file_route_id ? (
          <Button
            href={`localhost:3000/download/download-pdf/${entrega.doc_file_route.path}`}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            style={{ display: "block", marginTop: "5px" }}
          >
            {entrega.doc_file_route.path.split("\\").pop().split("/").pop()}
          </Button>
        ) : (
          <p>No hay archivo</p>
        )}
        {entrega.review && (
          <div style={{ marginTop: "10px" }}>
            <Typography
              variant="body2"
              color={
                entrega.review.status_review_id === 2
                  ? "green"
                  : entrega.review.status_review_id === 3
                  ? "orange"
                  : "textSecondary"
              }
            >
              Estado de la revisión: {getReviewStatus(entrega.review.status_review_id)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Comentarios: {entrega.review.comments}
            </Typography>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

export default ReviewItem;