#ifndef NODE_H
#define NODE_H

#include "bid.h"

class Node{
public:
    Bid bidData;
    Node* rightChild;
    Node* leftChild;
};

#endif // NODE_H
