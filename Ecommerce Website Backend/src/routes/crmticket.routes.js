import { Router } from "express";
import {
  createTicket,
  deleteTicket,
  generateTicketReport,
  getAllTickets,
  getTicketByCategory,
  getTicketById,
  getTicketByOrderId,
  getTicketByStatus,
  getTicketByUser,
  updateTicketReply,
  updateTicketStatus,
} from "../controllers/crmticket.controller.js";

const router = new Router();

router.route("/getalltickets").get(getAllTickets);
router.route("/getticketbyid").get(getTicketById);
router.route("/createticket").post(createTicket);
router.route("/updateticketreply").post(updateTicketReply);
router.route("/updateticketstatus").post(updateTicketStatus);
router.route("/deleteticket").delete(deleteTicket);
router.route("/getticketbyuser").get(getTicketByUser);
router.route("/getticketbystatus").get(getTicketByStatus);
router.route("/getticketbycategory").get(getTicketByCategory);
router.route("/getticketbyorderid").get(getTicketByOrderId);
router.route("/generateticketreport").post(generateTicketReport);

export default router;
