#include "mainwindow.h"
#include "addbid.h"
#include "ui_mainwindow.h"
#include "csvparser.h"
#include "bid.h"
#include "node.h"
#include "binarysearchtree.h"
#include <QTableWidget>
#include <QTableWidgetItem>
#include <QMessageBox>
#include <QInputDialog>
#include <QFileDialog>
#include <iostream>
#include <time.h>
#include <algorithm>

using namespace std;

AddBid *addBid;
static BinarySearchTree* bst;
vector<string> headings;
int numColumns = 0;
int numRows = 0;

// forward declarations
double strToDouble(string str, char ch);

void loadBids(string csvPath, BinarySearchTree* bst, vector<Bid>* bids) {

    // initialize the CSV Parser using the given path
    csv::Parser file = csv::Parser(csvPath);

    // read and display header row - optional
    vector<string> header = file.getHeader();
    for (auto const& c : header) {
        headings.push_back(c);
        numColumns++;
    }

    numRows = 0;

    try {
        // loop to read rows of a CSV file
        for (unsigned int i = 0; i < file.rowCount(); i++) {

            // Create a data structure and add to the collection of bids
            Bid bid;
            bid.title = file[i][0];
            bid.bidId = file[i][1];
            bid.department = file[i][2];
            bid.closeDate = file[i][3];
            bid.amount = strToDouble(file[i][4], '$');
            bid.inventoryID = file[i][5];
            bid.vehicleId = file[i][6];
            bid.receiptNum = file[i][7];
            bid.fund = file[i][8];

            // push this bid to the end
            bst->Insert(bid);
            bids->push_back(bid);
            numRows++;
        }
    } catch (csv::Error &e) {
        cerr << e.what() << endl;
    }
}

/**
 * Simple C function to convert a string to a double
 * after stripping out unwanted char
 *
 * credit: http://stackoverflow.com/a/24875936
 *
 * @param ch The character to strip out
 */
double strToDouble(string str, char ch) {
    str.erase(remove(str.begin(), str.end(), ch), str.end());
    return atof(str.c_str());
}

// Constructor for the MainWindow class
MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this); 
    rowSelected = -1;
}

// Destructor for the MainWindow class
MainWindow::~MainWindow()
{
    delete ui;
}

// Runs when "Open" is clicked from the menu
void MainWindow::on_actionOpen_2_triggered()
{
    Node* node = new Node;
    string bidKey;
    QUrl path = QFileDialog::getOpenFileName(this, tr("Open CSV"), tr("*.csv"));

    //QMessageBox::information(this, "File Path", QString::fromStdString("\"" + csvPath + "\""));

    if(path.isEmpty()){
        // do nothing, no file selected
    }
    else{
        string csvPath = path.toString().toStdString();
        bst = new BinarySearchTree(0, node, this);

        // Complete the method call to load the bids
        loadBids(csvPath, bst, &orderedBids);

        for(unsigned int i = 0; i < headings.size(); i++){
            tableHeader<<QString::fromStdString(headings[i]);
        }
        ui->tableWidget->setRowCount(0);
        ui->tableWidget->setColumnCount(numColumns);
        ui->tableWidget->setRowCount(numRows);
        ui->tableWidget->setHorizontalHeaderLabels(tableHeader);
        ui->tableWidget->verticalHeader()->setVisible(false);

        for(unsigned int i = 0; i < orderedBids.size(); i++){
            ui->tableWidget->setItem(i, 0, new QTableWidgetItem(QString::fromStdString(orderedBids[i].title)));
            ui->tableWidget->setItem(i, 1, new QTableWidgetItem(QString::fromStdString(orderedBids[i].bidId)));
            ui->tableWidget->setItem(i, 2, new QTableWidgetItem(QString::fromStdString(orderedBids[i].department)));
            ui->tableWidget->setItem(i, 3, new QTableWidgetItem(QString::fromStdString(orderedBids[i].closeDate)));
            ui->tableWidget->setItem(i, 4, new QTableWidgetItem(QString::number(orderedBids[i].amount)));
            ui->tableWidget->setItem(i, 5, new QTableWidgetItem(QString::fromStdString(orderedBids[i].inventoryID)));
            ui->tableWidget->setItem(i, 6, new QTableWidgetItem(QString::fromStdString(orderedBids[i].vehicleId)));
            ui->tableWidget->setItem(i, 7, new QTableWidgetItem(QString::fromStdString(orderedBids[i].receiptNum)));
            ui->tableWidget->setItem(i, 8, new QTableWidgetItem(QString::fromStdString(orderedBids[i].fund)));
        }

        ui->tableWidget->setSelectionBehavior(QAbstractItemView::SelectRows);
        connect( ui->tableWidget, SIGNAL( cellDoubleClicked (int, int) ), this, SLOT( cellShowSelected( int, int ) ) );
        connect( ui->tableWidget, SIGNAL( cellClicked (int, int) ), this, SLOT( cellSelected( int, int ) ) );
    }
}

void MainWindow::cellSelected(int nRow, int nCol){
    rowSelected = nRow;
}

void MainWindow::cellShowSelected(int nRow, int nCol)
{
    QMessageBox::information(this, "Bid Information",
        "Title:   " + QString::fromStdString(orderedBids[nRow].title) +
        "\n   ID:   " + QString::fromStdString(orderedBids[nRow].bidId) + "\n  Dpt:   " + QString::fromStdString(orderedBids[nRow].department) +
        "\nClose:   " + QString::fromStdString(orderedBids[nRow].closeDate) + "\n  Win:   $" + QString::number(orderedBids[nRow].amount) +
        "\n  Inv:   " + QString::fromStdString(orderedBids[nRow].inventoryID) + "\n  Veh:   " + QString::fromStdString(orderedBids[nRow].vehicleId) +
        "\nRec #:   " + QString::fromStdString(orderedBids[nRow].receiptNum) + "\n Fund:   " + QString::fromStdString(orderedBids[nRow].fund));
}

void MainWindow::on_pushButton_clicked()
{
    addBid = new AddBid(this, bst);
    addBid->show();
}

void MainWindow::reloadBidTable(){
    ui->tableWidget->setRowCount(0);
    orderedBids.clear();
    bst->InOrder();

    ui->tableWidget->setRowCount(orderedBids.size());
    for(unsigned int i = 0; i < orderedBids.size(); i++){
        ui->tableWidget->setItem(i, 0, new QTableWidgetItem(QString::fromStdString(orderedBids[i].title)));
        ui->tableWidget->setItem(i, 1, new QTableWidgetItem(QString::fromStdString(orderedBids[i].bidId)));
        ui->tableWidget->setItem(i, 2, new QTableWidgetItem(QString::fromStdString(orderedBids[i].department)));
        ui->tableWidget->setItem(i, 3, new QTableWidgetItem(QString::fromStdString(orderedBids[i].closeDate)));
        ui->tableWidget->setItem(i, 4, new QTableWidgetItem(QString::number(orderedBids[i].amount)));
        ui->tableWidget->setItem(i, 5, new QTableWidgetItem(QString::fromStdString(orderedBids[i].inventoryID)));
        ui->tableWidget->setItem(i, 6, new QTableWidgetItem(QString::fromStdString(orderedBids[i].vehicleId)));
        ui->tableWidget->setItem(i, 7, new QTableWidgetItem(QString::fromStdString(orderedBids[i].receiptNum)));
        ui->tableWidget->setItem(i, 8, new QTableWidgetItem(QString::fromStdString(orderedBids[i].fund)));
    }
}


void MainWindow::on_pushButton_3_clicked()
{
    if(rowSelected != -1){
        QMessageBox msgBox;
        msgBox.setText("This action can not be undone!");
        msgBox.setInformativeText("Are you sure you want to remove the chosen bid?");
        msgBox.setStandardButtons(QMessageBox::Ok | QMessageBox::Cancel);
        msgBox.setDefaultButton(QMessageBox::Cancel);
        int ret = msgBox.exec();

        switch (ret) {
            case QMessageBox::Ok:
                bst->Remove(orderedBids[rowSelected].bidId);
                this->reloadBidTable();
                break;
            case QMessageBox::Cancel:
                // Cancel was clicked
                break;
            default:
                // should never be reached
                break;
        }
    }
}

void MainWindow::on_pushButton_2_clicked()
{
    bool ok;
    QString text = QInputDialog::getText(this, tr("Search"),
        tr("Article ID: "), QLineEdit::Normal, "", &ok);

    if (ok && !text.isEmpty()){
        string id = text.toStdString();
        Bid result = bst->Search(id);

        if(!result.bidId.empty()){
            QMessageBox::information(this, "Bid Information",
                "Title:   " + QString::fromStdString(result.title) +
                "\n   ID:   " + QString::fromStdString(result.bidId) + "\n  Dpt:   " + QString::fromStdString(result.department) +
                "\nClose:   " + QString::fromStdString(result.closeDate) + "\n  Win:   $" + QString::number(result.amount) +
                "\n  Inv:   " + QString::fromStdString(result.inventoryID) + "\n  Veh:   " + QString::fromStdString(result.vehicleId) +
                "\nRec #:   " + QString::fromStdString(result.receiptNum) + "\n Fund:   " + QString::fromStdString(result.fund));

        }
        else{
            QMessageBox::information(this, "Bid Information", "Bid not found!");
        }
    }
    else{
        QMessageBox msgBox;
        msgBox.setText("Something went wrong!");
        msgBox.setStandardButtons(QMessageBox::Ok);
        msgBox.setDefaultButton(QMessageBox::Ok);
        msgBox.exec();
    }
}
