import * as React from "react";

import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";

import { Route, Routes, useNavigate } from "react-router-dom";

//Components
import BottomNavbar from "../../components/navigation/bottomNavbar";
import Navbar from "../../components/navigation/navbar";

//Pages
import NotificationCenter from "../../components/notificationCenter";
import PurchaseOrderDetails from "./purchaseOrderDetails";
import CreatePurchaseOrder from "./createPurchaseOrder";
import UpdatePurchaseOrder from "./updatePurchaseOrder";
import RawMaterialEntries from "./rawMaterialEntries";
import ProductionEntries from "./productionEntries";
import PurchaseOrders from "./purchaseOrders";
import References from "./references";
import Operators from "./operators";
import Providers from "./providers";
import Clients from "./clients";
import Users from "./users";
import Main from "./main";

import mainURL from "../../config/environment";
import $ from "jquery";
import SharpeningEntries from "./sharpeningEntries";

export default function Home(props) {
  const [openNC, setOpenNC] = React.useState(false);

  const navigate = useNavigate();

  const [notifications, setNotifications] = React.useState([]);

  const handleCloseDialogs = () => {
    setOpenNC(false);
  };

  const OnHoverClose = () => {
    if (openNC) {
      setTimeout(() => setOpenNC(!openNC), 1000);
      // console.log("Event:Mouseleave NC");
    }
  };

  const handleToggleNC = () => {
    setOpenNC(!openNC);
  };

  React.useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    let isSubscribed = true;
    $.ajax({
      method: "GET",
      url: `${mainURL}notification/references`,
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done((res) => {
        const aux = res.sort((a, b) => a.currentQuantity - b.currentQuantity);
        if (isSubscribed) setNotifications(aux);
      })
      .fail((res) => {
        if (res.status === 401) {
          alert("Session expired");
          localStorage.removeItem("userInfo");
          navigate("/login");
        }
      });
    return () => (isSubscribed = false);
  }, [navigate]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar
        handleToggle={handleToggleNC}
        notificationsLength={notifications.length}
        openNC={openNC}
      />
      <Box component="main" sx={{ flexGrow: 1, height: "93vh" }}>
        <Toolbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="usuarios" element={<Users />} />
          <Route path="clientes" element={<Clients />} />
          <Route path="proveedores" element={<Providers />} />
          <Route path="referencias" element={<References />} />
          <Route path="ordenes-compra" element={<PurchaseOrders />} />
          <Route path="operarios" element={<Operators />} />

          <Route
            path="ordenes-compra/crear"
            element={<CreatePurchaseOrder />}
          />
          <Route
            path="ordenes-compra/:orderId/editar"
            element={<UpdatePurchaseOrder />}
          />
          <Route
            path="ordenes-compra/:orderId"
            element={<PurchaseOrderDetails />}
          />
          <Route path="produccion" element={<ProductionEntries />} />
          <Route path="refinado" element={<SharpeningEntries />} />
          <Route path="materia-prima" element={<RawMaterialEntries />} />
        </Routes>
      </Box>
      <NotificationCenter
        open={openNC}
        notifications={notifications}
        handleClose={handleCloseDialogs}
        handleOnHoverClose={OnHoverClose}
      />
      <BottomNavbar />
    </Box>
  );
}
