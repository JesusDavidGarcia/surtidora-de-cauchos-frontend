import React, { useState, useEffect, useRef } from "react";

//Charts
import ReactEcharts from "echarts-for-react";

import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

import { useNavigate } from "react-router-dom";

//Excel export
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

//Jquery
import apiURL from "../../config/environment";
import $ from "jquery";
import {
  CardHeader,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Download } from "@mui/icons-material";
import FilterPopover from "../popovers/filter";

export default function LineChart(props) {
  const [chartSettings, setChartSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const { endpoint } = props;
  const { title } = props;

  const navigate = useNavigate();

  //Profile popover management
  const [anchorFilter, setAnchorFilter] = useState(null);
  const handlePopoverOpen = (event) => {
    setAnchorFilter(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorFilter(null);
  };

  const handleSubmit = (filter) => (event) => {
    setLoading(true);
    console.log(filter);
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    $.ajax({
      method: "GET",
      url: `${apiURL}report/production?detailed=${filter}`,
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done((res) => {
        setLoading(false);
        //console.log(res);
        //props.handleShowNotification("success", "Cliente agregado con éxito");
        const fileName = `Reporte ${
          filter ? "diario" : "mensual"
        } de producción surtidora de cauchos`;
        const fileType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        const ws = XLSX.utils.json_to_sheet(res);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, {
          bookType: "xlsx",
          type: "array",
        });

        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
      })
      .fail((res) => {
        setLoading(false);
        console.log(res);
      });
  };

  useEffect(() => {
    let isSubscribed = true;
    const token = JSON.parse(localStorage.getItem("userInfo")).token;

    $.ajax({
      method: "GET",
      url: apiURL + endpoint,
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done((res) => {
        const months = [];
        const produced = [];
        const wasted = [];

        res.forEach((element) => {
          months.push(element.month);
          produced.push(element.produced);
          wasted.push(element.wasted);
        });

        if (isSubscribed) {
          setChartSettings({
            color: ["#205ba7", "#fff000"],

            // Global text styles
            textStyle: {
              fontFamily: "Roboto, Arial, Verdana, sans-serif",
              fontSize: 13,
            },

            // Cha23rt animation duration
            animationDuration: 750,

            // Setup grid
            grid: {
              left: 10,
              right: 10,
              top: 35,
              bottom: 10,
              containLabel: true,
            },

            /* title: {
            text: "Number of accidents over the months",
            //subtext: subTitle,
            left: "center",
            textStyle: {
              fontSize: 17,
              fontWeight: 500,
            },
            subtextStyle: {
              fontSize: 12,
            },
            margin: 20,
          }, */

            // Add legend
            legend: {
              data: ["Producido", "Desperdiciado"],
              itemHeight: 5,
              itemGap: 5,
              top: "top",
            },

            // Add tooltip
            tooltip: {
              trigger: "axis",
              //backgroundColor: "rgba(0,0,0,0.75)",
              padding: [10, 15],
              textStyle: {
                fontSize: 13,
                fontFamily: "Roboto, sans-serif",
              },
            },

            // Horizontal axis
            xAxis: [
              {
                type: "category",
                boundaryGap: true,
                axisLabel: {
                  color: "#333",
                },
                axisLine: {
                  lineStyle: {
                    color: "#999",
                  },
                }, //Fechas
                data: months,
              },
            ],

            // Vertical axis
            yAxis: [
              {
                type: "value",
                axisLabel: {
                  formatter: "{value} ",
                  color: "#333",
                },
                axisLine: {
                  lineStyle: {
                    color: "#999",
                  },
                },
                splitLine: {
                  lineStyle: {
                    color: ["#eee"],
                  },
                },
                splitArea: {
                  show: true,
                  areaStyle: {
                    color: ["rgba(250,250,250,0.1)", "rgba(0,0,0,0.01)"],
                  },
                },
              },
            ],

            // Add series
            series: [
              {
                name: "Producido",
                type: months.length > 3 ? "line" : "bar",
                smooth: true,
                symbolSize: 6,
                itemStyle: {
                  //color: "#cbcb35",
                  borderWidth: 2,
                }, //Impression data
                barWidth: "20%",
                data: produced,
              },
              {
                name: "Desperdiciado",
                type: months.length > 3 ? "line" : "bar",
                smooth: true,
                symbolSize: 6,
                itemStyle: {
                  borderWidth: 2,
                },
                data: wasted,
                barWidth: "20%",
              },
            ],
          });
        }
      })
      .fail((res) => {
        if (res.status === 401) {
          alert("Sesión expirada");
          localStorage.removeItem("userInfo");
          navigate("/login");
        }
      });

    return () => (isSubscribed = false);
  }, [endpoint, navigate]);

  return (
    <Grid item md={12} xs={12} sx={{ pb: 10 }}>
      <FilterPopover
        open={anchorFilter}
        handleSubmit={handleSubmit}
        handleClose={handlePopoverClose}
      />
      <Card>
        <CardHeader
          title={title}
          titleTypographyProps={{ fontSize: "1.2rem" }}
          action={
            loading ? (
              <CircularProgress />
            ) : (
              <Tooltip title="Descargar informe de producción">
                <IconButton onClick={handlePopoverOpen}>
                  <Download color="primary" />
                </IconButton>
              </Tooltip>
            )
          }
        />
        <CardContent>
          <ReactEcharts ref={useRef("echarts_react")} option={chartSettings} />
        </CardContent>
      </Card>
    </Grid>
  );
}
