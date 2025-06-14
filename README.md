# Product Board Application

This simple command-line tool helps plan your SAP project backlog by managing
Requirements, Work Packages, and Work Items.

## Usage

Install Python 3 and run the `productboard.py` script with one of the commands
below. Data is persisted in `board.json` in the working directory.

### Add a requirement
```
python productboard/productboard.py add_requirement "Title" "Description"
```

### Add a work package linked to a requirement
```
python productboard/productboard.py add_package <requirement_id> "Title" "Description"
```

### Add a work item linked to a work package
```
python productboard/productboard.py add_item <package_id> "Title" "Description" [--status STATUS]
```

### List items
```
python productboard/productboard.py list_requirements
python productboard/productboard.py list_packages [requirement_id]
python productboard/productboard.py list_items [package_id]
```
