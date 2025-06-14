import tkinter as tk
from tkinter import ttk
from productboard.productboard import ProductBoard


class BoardGUI:
    def __init__(self, board: ProductBoard):
        self.board = board
        self.root = tk.Tk()
        self.root.title("Product Board GUI")
        self.tree = ttk.Treeview(self.root)
        self.tree.pack(fill=tk.BOTH, expand=True)

        self._populate()

        self.drag_item = None
        self.tree.bind("<ButtonPress-1>", self.on_start_drag)
        self.tree.bind("<ButtonRelease-1>", self.on_drop)

    def _populate(self):
        # Clear tree
        for item in self.tree.get_children():
            self.tree.delete(item)
        for req in self.board.requirements:
            rid = f"req_{req.id}"
            r_node = self.tree.insert("", "end", iid=rid, text=req.title, open=True)
            for pkg in [p for p in self.board.packages if p.requirement_id == req.id]:
                pid = f"pkg_{pkg.id}"
                p_node = self.tree.insert(r_node, "end", iid=pid, text=pkg.title, open=True)
                for itm in [i for i in self.board.items if i.package_id == pkg.id]:
                    iid = f"item_{itm.id}"
                    self.tree.insert(p_node, "end", iid=iid, text=itm.title)

    def on_start_drag(self, event):
        item = self.tree.identify_row(event.y)
        if item:
            self.drag_item = item

    def on_drop(self, event):
        if not self.drag_item:
            return
        dest = self.tree.identify_row(event.y)
        if not dest:
            self.drag_item = None
            return
        # Determine valid drops
        if self.drag_item.startswith("pkg_"):
            if dest.startswith("req_"):
                self.tree.move(self.drag_item, dest, "end")
                pkg_id = int(self.drag_item.split("_")[1])
                dest_req_id = int(dest.split("_")[1])
                for p in self.board.packages:
                    if p.id == pkg_id:
                        p.requirement_id = dest_req_id
                        break
        elif self.drag_item.startswith("item_"):
            # dropping on item -> use its parent
            if dest.startswith("item_"):
                dest = self.tree.parent(dest)
            if dest.startswith("pkg_"):
                self.tree.move(self.drag_item, dest, "end")
                item_id = int(self.drag_item.split("_")[1])
                dest_pkg_id = int(dest.split("_")[1])
                for i in self.board.items:
                    if i.id == item_id:
                        i.package_id = dest_pkg_id
                        break
        self.board._save()
        self.drag_item = None

    def run(self):
        self.root.mainloop()


if __name__ == "__main__":
    board = ProductBoard()
    gui = BoardGUI(board)
    gui.run()
