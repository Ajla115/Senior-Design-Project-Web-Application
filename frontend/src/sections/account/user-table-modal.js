import React from "react";
import PropTypes from "prop-types";
import { Modal as BaseModal } from "@mui/base/Modal";
import Fade from "@mui/material/Fade";
import { styled, css } from "@mui/system";
import { Box, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UserTable from "./user-table";



const UserTableModal = ({ isOpen, onClose, refetch }) => {
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
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 id="transition-modal-title" className="modal-title">
              User List
            </h2>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ padding: 2 }}>
            <UserTable refetch={refetch} />
          </Box>
          <Box sx={{ textAlign: 'right', marginTop: 1, marginBottom: 1, marginRight: 1 }}>
            <Button variant="contained" color="primary" onClick={onClose}>
              Close
            </Button>
          </Box>
        </ModalContent>
      </Fade>
    </Modal>
  );
};

UserTableModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
};

const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBackdrop = styled("div")`
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
  width: '90%', // Adjust the width as needed
  maxWidth: 850,
  backgroundColor: "#fff",
  boxShadow: "0 4px 12px rgb(0 0 0 / 0.2)"
};

const ModalContent = styled("div")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow: hidden;
    background-color: ${theme.palette.mode === "dark" ? "#303740" : "#fff"};
    
    border: 1px solid ${theme.palette.mode === "dark" ? "#434D5B" : "#DAE2ED"};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === "dark" ? "rgb(0 0 0 / 0.5)" : "rgb(0 0 0 / 0.2)"};
    padding: 0; // Remove extra padding
    color: ${theme.palette.mode === "dark" ? "#F3F6F9" : "#1C2025"};

    & .modal-title {
      margin: 16px;
      line-height: 1.5rem;
      margin-bottom: 8px;
    }

    & .modal-description {
      margin: 0;
      line-height: 1.5rem;
      font-weight: 400;
      color: ${theme.palette.mode === "dark" ? "#B0B8C4" : "#434D5B"};
      margin-bottom: 4px;
    }
  `
);

export default UserTableModal;
