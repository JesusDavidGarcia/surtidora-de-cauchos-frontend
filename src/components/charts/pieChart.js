import React, { useState, useEffect, useRef } from "react";

//Charts
import ReactEcharts from "echarts-for-react";

import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

//Jquery
import URL from "../../config/environment";
import $ from "jquery";

export default function PieChart(props) {
  const [chartSettings, setChartSettings] = useState({});
  const { endpoint, format, title } = props;

  useEffect(() => {
    let isSubscribed = true;
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    const host = JSON.parse(localStorage.getItem("userInfo")).hostName;
    $.ajax({
      method: "GET",
      url: URL + endpoint,
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
        hostname: host,
      },
    }).done((res) => {
      if (isSubscribed) {
        const data = res;

        setChartSettings({
          color: ["#979797", "#404470", "#1e76ac", "#cdcd35"],
          // Global text styles
          textStyle: {
            fontFamily: "Roboto, Arial, Verdana, sans-serif",
            fontSize: 13,
          },

          // Add tooltip
          tooltip: {
            trigger: "item",
            //backgroundColor: "rgba(0,0,0,0.75)",
            padding: [10, 15],
            textStyle: {
              fontSize: 13,
              fontFamily: "Roboto, sans-serif",
            },
            formatter: `{b}: {c} ${format}`,
          },

          // Add legend

          // Add series
          series: [
            {
              // name: "Increase (brutto)",
              type: "pie",
              radius: ["10%", "50%"],
              center: ["50%", "50%"],
              roseType: "radius",
              itemStyle: {
                borderWidth: 1,
                borderColor: "#fff",
              },
              data: data,
            },
          ],
        });
      }
    });

    return () => (isSubscribed = false);
  }, [endpoint, title, format]);

  return (
    <Grid item md={12} xs={12} sx={{ pb: 10 }}>
      <Card>
        <CardHeader
          title={title}
          titleTypographyProps={{ fontSize: "1.2rem" }}
        />
        <CardContent>
          <ReactEcharts ref={useRef("echarts_react")} option={chartSettings} />
        </CardContent>
      </Card>
    </Grid>
  );
}
