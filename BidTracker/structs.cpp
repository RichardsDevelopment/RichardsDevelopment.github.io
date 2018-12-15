#include "structs.h"

// define a structure to hold bid information
struct Bid {
    std::string bidId; // unique identifier
    std::string title;
    std::string fund;
    std::string department;
    std::string closeDate;
    std::string inventoryID;
    std::string vehicleId;
    std::string receiptNum;
    double amount;
    Bid() {
        amount = 0.0;
    }
};

struct Node {
    Bid bidData;
    Node* rightChild;
    Node* leftChild;
};
