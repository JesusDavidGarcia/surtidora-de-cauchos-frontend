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
import SharpenersMatrix from "./sharpeningCurrentState";
import PackagingEntries from "./packagingEntries";
import PackagingMatrix from "./packagingCurrentState";
import Packaging from "./packaging";

export default function Home(props) {
  const [openNC, setOpenNC] = React.useState(false);

  const navigate = useNavigate();

  const [notifications, setNotifications] = React.useState([]);
  const [onlyBelow, setOnlyBelow] = React.useState(false);
  const [sharpening, setSharpening] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [columns, setColumns] = React.useState([]);

  const handleToggleOnlyBelow = () => {
    setOnlyBelow(!onlyBelow);
  };

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
    setLoading(true);
    $.ajax({
      method: "GET",
      url: `${mainURL}notification/references?onlyBelow=${onlyBelow}`,
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done((res) => {
        const aux = res.sort((a, b) => a.currentQuantity - b.currentQuantity);
        if (isSubscribed) setNotifications(aux);
        setLoading(false);
      })
      .fail((res) => {
        if (res.status === 401) {
          alert("Session expired");
          localStorage.removeItem("userInfo");
          navigate("/login");
        }
      });
    return () => (isSubscribed = false);
  }, [navigate, onlyBelow]);

  React.useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    let isSubscribed = true;
    //handleShowNotification("info", "Cargando clientes");
    //setLoading(true);
    $.ajax({
      method: "GET",
      url: mainURL + "operator-sharpening/get-all",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done((res) => {
        const filtered = res.filter((m) => m.quantity > 0);

        const sharpeners = [...new Set(filtered.map((item) => item.sharpener))];
        const references = [
          ...new Set(filtered.map((item) => item.referenceName)),
        ];
        const combination = [
          ...new Set(
            filtered.map((item, idx) => ({
              id: idx,
              [item.sharpener]: item.quantity.toFixed(2),
              Referencia: item.referenceName,
            }))
          ),
        ];

        const columns = sharpeners.map((item) => ({
          headerName: item,
          field: item,
          flex: 1,
          breakpoints: ["xs", "sm", "md", "lg", "xl"],
        }));

        columns.unshift({
          headerName: "Referencia",
          field: "Referencia",
          flex: 1,
          breakpoints: ["xs", "sm", "md", "lg", "xl"],
        });

        const rows = [];

        references.forEach((ref) => {
          rows.push(
            combination
              .filter((m) => m.Referencia === ref)
              .reduce((r, c) => Object.assign(r, c), {})
          );
        });

        if (isSubscribed) {
          setColumns(columns);
          setSharpening(rows);
        }
      })
      .fail((res) => {});
    return () => (isSubscribed = false);
  }, []);

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
          <Route path="ingresos-refilado" element={<SharpeningEntries />} />
          <Route path="ingresos-empacado" element={<PackagingEntries />} />
          <Route path="actualidad-refilado" element={<SharpenersMatrix />} />
          <Route path="actualidad-empacado" element={<PackagingMatrix />} />
          <Route path="materia-prima" element={<RawMaterialEntries />} />
          <Route path="empaques" element={<Packaging />} />
        </Routes>
      </Box>
      <NotificationCenter
        open={openNC}
        loading={loading}
        columns={columns}
        onlyBelow={onlyBelow}
        sharpening={sharpening}
        notifications={notifications}
        handleClose={handleCloseDialogs}
        handleOnHoverClose={OnHoverClose}
        handleToggleOnlyBelow={handleToggleOnlyBelow}
      />
      <BottomNavbar />
    </Box>
  );
}
