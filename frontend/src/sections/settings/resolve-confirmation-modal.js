import React, { useState } from "react";
import PropTypes from "prop-types";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import Fade from "@mui/material/Fade";
import { Button, Stack, CardActions } from "@mui/material";
import { useMutation, QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { UserService } from "services";

const ResolveConfirmationModal = ({ isOpen, onClose, ticketId, refetch }) => {
  const client = new QueryClient();
  const [isResolved, setIsResolved] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await UserService.resolveCustomerServiceTicket(ticketId);
      return response;
    },
    onSuccess: (response) => {
      setIsResolved(true);
      refetch();
      onClose();
      alert(response.message);
    },
    onError: (error) => {
      onClose();
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error("Error resolving ticket:", error);
    },
  });

  const handleResolve = async () => {
    try {
      await mutation.mutateAsync();
    } catch (error) {
      console.error("Error resolving ticket:", error);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      closeAfterTransition
      slots={{ backdrop: StyledBackdrop }}
    >
      <Fade in={isOpen}>
        <ModalContent sx={style}>
          <h2 id="transition-modal-title" className="modal-title">
            Confirmation
          </h2>
          <p id="transition-modal-description" className="modal-description">
            Are you sure you want to resolve the ticket with ID: {ticketId}?
          </p>
          <Stack spacing={5} sx={{ maxWidth: 300, marginLeft: 22 }} direction="row">
            <CardActions>
              <Button variant="contained" color="error" onClick={onClose}>
                No
              </Button>
              <QueryClientProvider client={client}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleResolve}
                  disabled={mutation.isLoading}
                >
                  Yes
                </Button>
              </QueryClientProvider>
            </CardActions>
          </Stack>
        </ModalContent>
      </Fade>
    </Modal>
  );
};

ResolveConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  ticketId: PropTypes.number.isRequired,
  refetch: PropTypes.func.isRequired,
};

const Backdrop = React.forwardRef((props, ref) => {
  const { open, ...other } = props;
  return (
    <Fade in={open}>
      <div ref={ref} {...other} />
    </Fade>
  );
});

Backdrop.propTypes = {
  open: PropTypes.bool,
};

const blue = {
  200: "#99CCFF",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0066CC",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
};

const ModalContent = styled("div")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === "dark" ? "rgb(0 0 0 / 0.5)" : "rgb(0 0 0 / 0.2)"};
    padding: 24px;
    color: ${theme.palette.mode === "dark" ? grey[50] : grey[900]};

    & .modal-title {
      margin: 0;
      line-height: 1.5rem;
      margin-bottom: 8px;
    }

    & .modal-description {
      margin: 0;
      line-height: 1.5rem;
      font-weight: 400;
      color: ${theme.palette.mode === "dark" ? grey[400] : grey[800]};
      margin-bottom: 4px;
    }
  `
);

export default ResolveConfirmationModal;
