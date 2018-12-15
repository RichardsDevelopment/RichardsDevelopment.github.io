#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QTableWidget>
#include "bid.h"
#include <vector>

namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = nullptr);
    void reloadBidTable();
    Ui::MainWindow *ui;
    ~MainWindow();
    std::vector<Bid> orderedBids;

private slots:
    void on_actionOpen_2_triggered();
    void cellShowSelected(int nRow, int nCol);
    void cellSelected(int nRow, int nCol);
    void on_pushButton_clicked();

    void on_pushButton_3_clicked();

    void on_pushButton_2_clicked();

private:
    QStringList tableHeader;
    int rowSelected;
};

#endif // MAINWINDOW_H
