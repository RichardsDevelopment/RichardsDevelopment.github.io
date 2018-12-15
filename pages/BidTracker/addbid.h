#ifndef ADDBID_H
#define ADDBID_H

#include <QDialog>
#include "ui_addbid.h"
#include "bid.h"
#include "binarysearchtree.h"
#include "mainwindow.h"

class AddBid : public QDialog, public Ui::AddBid{
    Q_OBJECT

public:
    AddBid(MainWindow* parent, BinarySearchTree* binst);
private slots:
    void on_buttonBox_accepted();
private:
    BinarySearchTree* bst;
    MainWindow* main;
};

#endif // ADDBID_H
