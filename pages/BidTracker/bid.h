#ifndef BID_H
#define BID_H

#include <string>

class Bid{

public:
    std::string bidId; // unique identifier
    std::string title;
    std::string fund;
    std::string department;
    std::string closeDate;
    std::string inventoryID;
    std::string vehicleId;
    std::string receiptNum;
    double amount;
    Bid();
};

#endif // BID_H
