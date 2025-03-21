import React, { useState } from "react";
import {
	Overlay,
	PopUpContainer,
} from "./style/create-schedule/PopUpDatesAndProgress.style";
import Select from "react-select";
import { Button } from "@mui/material";

const PopUpDirectorAddUser = ({
	open,
	onClose,
	onAddUsers,
	users,
	existingUsers,
}) => {
	const [selectedUser, setSelectedUser] = useState(null);

	const handleAddUser = () => {
		if (selectedUser) {
			onAddUsers([selectedUser]);
		}
		onClose();
	};

	if (!open) return null;
	// Filtrar los usuarios que ya están en la lista de scheduleCart
	const availableUsers = users.filter(
		(user) =>
			!existingUsers.some((existingUser) => existingUser.id_user === user.id),
	);

	return (
		<Overlay>
			<PopUpContainer>
				<h2>Agregar Usuario</h2>
				<div>
					<Select
						options={availableUsers.map((user) => ({
							value: user.id,
							label: `${user.name} ${user.paternal_surname} ${user.maternal_surname}`,
						}))}
						onChange={(newValue) => setSelectedUser(newValue)}
					/>
				</div>
				<div style={{ marginTop: "20px", textAlign: "right" }}>
					<Button onClick={onClose} style={{ marginRight: "10px" }}>
						Cancelar
					</Button>
					<Button onClick={handleAddUser} variant="contained" color="primary">
						Agregar
					</Button>
				</div>
			</PopUpContainer>
		</Overlay>
	);
};

export default PopUpDirectorAddUser;
