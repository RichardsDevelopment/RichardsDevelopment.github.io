#include "addbid.h"

/* ================= AddBid Namespace ================ */

AddBid::AddBid(MainWindow* mwin, BinarySearchTree* binst){
    setupUi(this);
    bst = binst;
    main = mwin;
}

void AddBid::on_buttonBox_accepted()
{
    Bid newBid;
    newBid.title = this->title->text().toStdString();
    newBid.bidId = this->id->text().toStdString();
    newBid.department = this->department->text().toStdString();
    newBid.fund = this->fund->text().toStdString();
    newBid.closeDate = this->date->text().toStdString();
    newBid.inventoryID = this->invID->text().toStdString();
    newBid.vehicleId = this->vehID->text().toStdString();
    newBid.receiptNum = this->recNum->text().toStdString();
    newBid.amount = this->bid->text().toDouble();

    bst->Insert(newBid);

    main->reloadBidTable();
}
