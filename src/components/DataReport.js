import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { padding: 20, fontSize: 12, position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" },
    title: { fontSize: 16, marginBottom: 10, textAlign: "center", position: "absolute", top: 100, left: 0, right: 0, fontWeight: "900" },
    section: { marginBottom: 10 },
    label: { fontWeight: "bold" },
    table: {
        display: "table",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        marginTop: 10,
    },
    tableRow: {
        flexDirection: "row",
    },
    tableColHeader: {
        width: "50%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: "#BBA2CE70",
        padding: 4,
        textAlign: "center",
    },
    tableCol: {
        width: "50%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 4,
        textAlign: "center",
        backgroundColor: "#BBA2CE30"
    },
    tableCellHeader: { fontSize: 12, fontWeight: "bold", textAlign: "center" },
    tableCell: { fontSize: 12, textAlign: "center" },
    footer: {
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 10,
        color: "#8d8d8d",
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 30,
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 15,
        color: "#1d1d1d",
        fontWeight: "600",
        gap: "15px",
    },
    headerText: {
        fontSize: 15,
    },
    headerImage: {
        width: "100px",
        height: "auto",
    },
    image: {
        width: "100%",
        height: "auto",
    }
});

const DataReport = ({ parameter, logo }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Image src={logo} style={styles.headerImage} />
                <Text style={styles.headerText}>
                    Exide Energy Solution Ltd
                </Text>
            </View>
            <Text style={styles.title}>Pin Traceability Report</Text>

            {/* Options Table */}
            {parameter.options && parameter.options.length > 0 && (
                <View style={styles.table}>
                    {/* Header Row */}
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColHeader, { width: "25%" }]}>
                            <Text style={styles.tableCellHeader}>Bin Number</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: "60%" }]}>
                            <Text style={styles.tableCellHeader}>Captured Image</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: "15%" }]}>
                            <Text style={styles.tableCellHeader}>Status</Text>
                        </View>
                    </View>

                    {/* Data Rows */}
                    {parameter.options.map((opt) => (
                        <View style={styles.tableRow} key={opt.id}>
                            <View style={[styles.tableCol, { width: "25%" }]}>
                                <Text style={styles.tableCell}>{opt.qrCodeData}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: "60%" }]}>
                                <Image src={"http://localhost:3000/"+opt.imagePath.slice(10)} style={styles.image} />
                            </View>
                            <View style={[styles.tableCol, { width: "15%" }]}>
                                {
                                    opt.status === "NG" ? <Text style={[styles.tableCell, {color: "red", fontWeight: "700",}]}>{opt.status}</Text> : <Text style={[styles.tableCell, {color: "green", fontWeight: "700",}]}>{opt.status}</Text>
                                }
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {/* Footer */}
            <Text style={styles.footer}>
                This is a system generated report. No signature required.
            </Text>
        </Page>
    </Document>
);

export default DataReport;
