#include "binarysearchtree.h"

/**
 * Default constructor
 */
BinarySearchTree::BinarySearchTree(int val, Node* node, MainWindow* main) {
    // initialize housekeeping variables
    mainWin = main;
    if(val == 0){
        this->root = 0;
    }
    else{
        this->root = node;
    }
}

/**
 * Destructor
 */
BinarySearchTree::~BinarySearchTree() {
    // recurse from root deleting every node
}

/**
 * Traverse the tree in order
 */
void BinarySearchTree::InOrder() {
    if(this->root == 0){
        return;
    }

    inOrder(this->root);
    return;
}
/**
 * Insert a bid
 */
void BinarySearchTree::Insert(Bid bid) {
    Node* node = new Node;
    Node* current = new Node;

    node->bidData = bid;
    node->leftChild = 0;
    node->rightChild = 0;

    //cout << "checking if root..." << endl;
    if (this->root == 0){
        //cout << "no root detected..." << endl;
        this->root = node;
        node->leftChild = 0;
        node->rightChild = 0;
    }
    else{
        //cout << "root detected..." << endl;
        current = this->root;
        while(current != 0){
            if(node->bidData.bidId < current->bidData.bidId){
                if(current->leftChild == 0){
                    current->leftChild = node;
                    current = 0;
                }
                else{
                    current = current->leftChild;
                }
            }
            else{
                if(current->rightChild == 0){
                    current->rightChild = node;
                    current = 0;
                }
                else{
                    current = current->rightChild;
                }
            }
        }
        node->leftChild = 0;
        node->rightChild = 0;
    }
}

/**
 * Remove a bid
 */
void BinarySearchTree::Remove(std::string bidId) {
    // FIXME (4a) Implement removing a bid from the tree
    Node* parent = 0;
    Node* current = this->root;

    while(current != 0){
        if(current->bidData.bidId == bidId){
            if(current->leftChild == 0 && current->rightChild == 0){
                if(!parent){
                    this->root = 0;
                }
                else if(parent->leftChild == current){
                    parent->leftChild = 0;
                }
                else{
                    parent->rightChild = 0;
                }
            }
            else if(current->leftChild && current->rightChild == 0){
                if(!parent){
                    this->root = current->leftChild;
                }
                else if(parent->leftChild == current){
                    parent->leftChild = current->leftChild;
                }
                else{
                    parent->rightChild = current->leftChild;
                }
            }
            else if(current->leftChild == 0 && current->rightChild){
                if(!parent){
                    this->root = current->rightChild;
                }
                else if(parent->leftChild == current){
                    parent->leftChild = current->rightChild;
                }
                else{
                    parent->rightChild = current->rightChild;
                }
            }
            else{
                Node* successor = current->rightChild;
                while(successor->leftChild != 0){
                    successor = successor->leftChild;
                }
                addNode(current, successor->bidData);
                BinarySearchTree* newRoot = new BinarySearchTree(1, current->rightChild, mainWin);
                newRoot->Remove(successor->bidData.bidId);
            }
            return;
        }
        else if(current->bidData.bidId < bidId){
            parent = current;
            current = current->rightChild;
        }
        else{
            parent = current;
            current = current->leftChild;
        }
    }
    return;
}

/**
 * Search for a bid
 */
Bid BinarySearchTree::Search(std::string bidId) {
    // FIXME (3) Implement searching the tree for a bid
    Bid bid;

    Node* current = new Node;

    current = this->root;

    while(current != 0){
        if(bidId == current->bidData.bidId){
            return current->bidData;
        }
        else if(bidId < current->bidData.bidId){
            current = current->leftChild;
        }
        else{
            current = current->rightChild;
        }
    }

    return bid;
}

/**
 * Add a bid to some node (recursive)
 *
 * @param node Current node in tree
 * @param bid Bid to be added
 */
void BinarySearchTree::addNode(Node* node, Bid bid) {
    node->bidData = bid;

    return;
}

void BinarySearchTree::inOrder(Node* node) {
    if(node == 0){
        return;
    }

    this->inOrder(node->leftChild);
    this->mainWin->orderedBids.push_back(node->bidData);
    this->inOrder(node->rightChild);
}
