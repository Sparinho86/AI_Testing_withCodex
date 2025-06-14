import json
import os
import argparse
from dataclasses import dataclass, asdict
from typing import List

@dataclass
class Requirement:
    id: int
    title: str
    description: str

@dataclass
class WorkPackage:
    id: int
    requirement_id: int
    title: str
    description: str

@dataclass
class WorkItem:
    id: int
    package_id: int
    title: str
    description: str
    status: str = "TODO"

class ProductBoard:
    def __init__(self, file_path: str = "board.json"):
        self.file_path = file_path
        self.requirements: List[Requirement] = []
        self.packages: List[WorkPackage] = []
        self.items: List[WorkItem] = []
        self._load()

    def _load(self):
        if os.path.exists(self.file_path):
            with open(self.file_path, "r") as f:
                data = json.load(f)
            self.requirements = [Requirement(**r) for r in data.get("requirements", [])]
            self.packages = [WorkPackage(**p) for p in data.get("packages", [])]
            self.items = [WorkItem(**i) for i in data.get("items", [])]

    def _save(self):
        data = {
            "requirements": [asdict(r) for r in self.requirements],
            "packages": [asdict(p) for p in self.packages],
            "items": [asdict(i) for i in self.items],
        }
        with open(self.file_path, "w") as f:
            json.dump(data, f, indent=2)

    def add_requirement(self, title: str, description: str):
        r_id = len(self.requirements) + 1
        req = Requirement(r_id, title, description)
        self.requirements.append(req)
        self._save()
        return req

    def add_work_package(self, requirement_id: int, title: str, description: str):
        p_id = len(self.packages) + 1
        pkg = WorkPackage(p_id, requirement_id, title, description)
        self.packages.append(pkg)
        self._save()
        return pkg

    def add_work_item(self, package_id: int, title: str, description: str, status: str = "TODO"):
        i_id = len(self.items) + 1
        item = WorkItem(i_id, package_id, title, description, status)
        self.items.append(item)
        self._save()
        return item

    def list_requirements(self):
        for req in self.requirements:
            print(f"[{req.id}] {req.title} - {req.description}")

    def list_packages(self, requirement_id: int = None):
        for pkg in self.packages:
            if requirement_id is None or pkg.requirement_id == requirement_id:
                print(f"[{pkg.id}] Req {pkg.requirement_id}: {pkg.title} - {pkg.description}")

    def list_items(self, package_id: int = None):
        for item in self.items:
            if package_id is None or item.package_id == package_id:
                print(
                    f"[{item.id}] Pkg {item.package_id}: {item.title} - {item.description} ({item.status})"
                )


def main():
    parser = argparse.ArgumentParser(description="Simple Product Board")
    subparsers = parser.add_subparsers(dest="command")

    parser_add_r = subparsers.add_parser("add_requirement")
    parser_add_r.add_argument("title")
    parser_add_r.add_argument("description")

    parser_add_p = subparsers.add_parser("add_package")
    parser_add_p.add_argument("requirement_id", type=int)
    parser_add_p.add_argument("title")
    parser_add_p.add_argument("description")

    parser_add_i = subparsers.add_parser("add_item")
    parser_add_i.add_argument("package_id", type=int)
    parser_add_i.add_argument("title")
    parser_add_i.add_argument("description")
    parser_add_i.add_argument("--status", default="TODO")

    subparsers.add_parser("list_requirements")

    parser_lp = subparsers.add_parser("list_packages")
    parser_lp.add_argument("requirement_id", type=int, nargs="?")

    parser_li = subparsers.add_parser("list_items")
    parser_li.add_argument("package_id", type=int, nargs="?")

    args = parser.parse_args()
    board = ProductBoard()

    if args.command == "add_requirement":
        board.add_requirement(args.title, args.description)
    elif args.command == "add_package":
        board.add_work_package(args.requirement_id, args.title, args.description)
    elif args.command == "add_item":
        board.add_work_item(args.package_id, args.title, args.description, status=args.status)
    elif args.command == "list_requirements":
        board.list_requirements()
    elif args.command == "list_packages":
        board.list_packages(args.requirement_id)
    elif args.command == "list_items":
        board.list_items(args.package_id)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
