import apiBackend from "./api";

export const fSendEmailSchedule = async (period_number: number) => {
  try {
    const response = await apiBackend.post(
      `/email/send_emails_schedule/${period_number}`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending emails", error);
    throw error;
  }
};
