import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Box,
  CheckCircle2,
  ChevronDown,
  Edit3,
  Eye,
  Filter,
  LayoutDashboard,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  X,
  AlertTriangle,
  IndianRupee
} from "lucide-react";

const STORAGE_KEY = "gupio-products-v1";

const initialProducts = [
  {
    id: "P-1001",
    name: "Wireless Headphones",
    category: "Electronics",
    price: 2499,
    stock: 24,
    description:
      "Comfortable over-ear wireless headphones with clear sound and long battery life."
  },
  {
    id: "P-1002",
    name: "Running Shoes",
    category: "Footwear",
    price: 3299,
    stock: 8,
    description:
      "Lightweight running shoes designed for everyday workouts and outdoor runs."
  },
  {
    id: "P-1003",
    name: "Cotton T-Shirt",
    category: "Fashion",
    price: 799,
    stock: 42,
    description:
      "Soft regular-fit cotton T-shirt suitable for casual everyday wear."
  },
  {
    id: "P-1004",
    name: "Smart Watch",
    category: "Electronics",
    price: 4599,
    stock: 0,
    description:
      "Smart watch with activity tracking, notifications and a bright display."
  },
  {
    id: "P-1005",
    name: "Backpack",
    category: "Accessories",
    price: 1299,
    stock: 15,
    description:
      "Durable everyday backpack with multiple compartments and laptop storage."
  }
];

const emptyForm = {
  name: "",
  category: "",
  price: "",
  stock: "",
  description: ""
};

function loadProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialProducts;
  } catch {
    return initialProducts;
  }
}

function App() {
  const [products, setProducts] = useState(loadProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [stockFilter, setStockFilter] = useState("all");

  const [modal, setModal] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 2800);

    return () => clearTimeout(timer);
  }, [toast]);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "inStock" && product.stock > 10) ||
        (stockFilter === "lowStock" &&
          product.stock > 0 &&
          product.stock <= 10) ||
        (stockFilter === "outOfStock" && product.stock === 0);

      return matchesSearch && matchesCategory && matchesStock;
    });

    if (sort === "low") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, search, category, sort, stockFilter]);

  const stats = useMemo(() => {
    const totalStock = products.reduce(
      (sum, product) => sum + Number(product.stock),
      0
    );

    const lowStock = products.filter(
      (product) => product.stock > 0 && product.stock <= 10
    ).length;

    const outOfStock = products.filter(
      (product) => product.stock === 0
    ).length;

    return {
      total: products.length,
      totalStock,
      lowStock,
      outOfStock
    };
  }, [products]);

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  function openCreate() {
    setEditingProduct(null);
    setModal("form");
  }

  function openEdit(product) {
    setEditingProduct(product);
    setModal("form");
  }

  function saveProduct(product) {
    if (editingProduct) {
      setProducts((current) =>
        current.map((item) =>
          item.id === editingProduct.id ? product : item
        )
      );

      showToast("Product updated successfully.");
    } else {
      setProducts((current) => [
        {
          ...product,
          id: createId()
        },
        ...current
      ]);

      showToast("Product created successfully.");
    }

    setModal(null);
    setEditingProduct(null);
  }

  function deleteProduct(id) {
    const product = products.find((p) => p.id === id);

    if (!product) return;

    if (
      !window.confirm(
        `Delete "${product.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setProducts((current) =>
      current.filter((product) => product.id !== id)
    );

    if (selectedProduct?.id === id) {
      setSelectedProduct(null);
    }

    showToast("Product deleted successfully.");
  }

  function resetDemoData() {
    if (
      !window.confirm(
        "Reset the dashboard to the original sample products?"
      )
    ) {
      return;
    }

    setProducts(initialProducts);
    setSearch("");
    setCategory("All");
    setSort("default");
    setStockFilter("all");

    showToast("Sample products restored.");
  }

  function resetFilters() {
    setSearch("");
    setCategory("All");
    setSort("default");
    setStockFilter("all");
  }

  function handleProductsNav() {
    setStockFilter("all");
    setSearch("");
    setCategory("All");
    setSort("default");
  }

  return (
    <div className="app-shell">
      <Sidebar onProductsClick={handleProductsNav} />

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Product Management</h1>
          </div>

          <button className="primary-btn" onClick={openCreate}>
            <Plus size={18} />
            Add Product
          </button>
        </header>

        <section className="stats-grid">
          <StatCard
            icon={<Package />}
            label="Total Products"
            value={stats.total}
            active={stockFilter === "all"}
            onClick={() => setStockFilter("all")}
          />

          <StatCard
            icon={<ShoppingBag />}
            label="Units in Stock"
            value={stats.totalStock}
            active={stockFilter === "inStock"}
            onClick={() => setStockFilter("inStock")}
          />

          <StatCard
            icon={<AlertTriangle />}
            label="Low Stock"
            value={stats.lowStock}
            tone="warning"
            active={stockFilter === "lowStock"}
            onClick={() => setStockFilter("lowStock")}
          />

          <StatCard
            icon={<BarChart3 />}
            label="Out of Stock"
            value={stats.outOfStock}
            tone="danger"
            active={stockFilter === "outOfStock"}
            onClick={() => setStockFilter("outOfStock")}
          />
        </section>
        <section className="content-card">
          <div className="toolbar">
            <div className="search-box">
              <Search size={18} />

              <input
                aria-label="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by name..."
              />

              {search && (
                <button
                  className="clear-search"
                  onClick={() => setSearch("")}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="toolbar-actions">
              <div className="select-wrap">
                <Filter size={16} />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  aria-label="Filter by category"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item === "All" ? "All categories" : item}
                    </option>
                  ))}
                </select>

                <ChevronDown size={15} />
              </div>

              <div className="select-wrap">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  aria-label="Sort by price"
                >
                  <option value="default">Sort: Default</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                </select>

                <ChevronDown size={15} />
              </div>
            </div>
          </div>

          <div className="table-meta">
            <span>
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""} shown
            </span>

            {(search ||
              category !== "All" ||
              sort !== "default" ||
              stockFilter !== "all") && (
              <button
                className="reset-btn"
                onClick={resetFilters}
              >
                Show all products
              </button>
            )}
          </div>

          <ProductTable
            products={filteredProducts}
            onView={(product) => {
              setSelectedProduct(product);
              setModal("details");
            }}
            onEdit={openEdit}
            onDelete={deleteProduct}
          />
        </section>

        <footer className="footer">
          <span>
            Product Management Dashboard • Local data using browser
            localStorage
          </span>

          <button onClick={resetDemoData}>
            Reset demo data
          </button>
        </footer>
      </main>

      {modal === "form" && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setModal(null);
            setEditingProduct(null);
          }}
          onSave={saveProduct}
        />
      )}

      {modal === "details" && selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => {
            setModal(null);
            setSelectedProduct(null);
          }}
          onEdit={() => {
            setModal("form");
            setEditingProduct(selectedProduct);
          }}
        />
      )}

      {toast && (
        <div className={`toast ${toast.type}`}>
          <CheckCircle2 size={18} />
          {toast.message}
        </div>
      )}
    </div>
  );
}

function Sidebar({ onProductsClick }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <Box size={21} />
        </div>

        <div>
          <strong>Dashboard</strong>
        </div>
      </div>

      <nav>
        <div className="nav-item active">
          <LayoutDashboard size={18} />
          Dashboard
        </div>

        <button
          type="button"
          className="nav-item nav-button"
          onClick={onProductsClick}
        >
          <Package size={18} />
          Products
        </button>
      </nav>

      <div className="sidebar-note">
        <strong>Frontend Assignment</strong>
        <span>
          Option 2 • Product Management Dashboard
        </span>
      </div>
    </aside>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone = "",
  active = false,
  onClick
}) {
  return (
    <button
      type="button"
      className={`stat-card ${tone} ${active ? "selected" : ""}`}
      onClick={onClick}
    >
      <div className="stat-icon">{icon}</div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </button>
  );
}
function ProductTable({ products, onView, onEdit, onDelete }) {
  if (!products.length) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <Search size={25} />
        </div>

        <h3>No products found</h3>

        <p>
          Try another search term or change the category or stock filter.
        </p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>PRODUCT</th>
            <th>CATEGORY</th>
            <th>PRICE</th>
            <th>STOCK</th>
            <th>STATUS</th>
            <th className="actions-heading">ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div className="product-cell">
                  <div className="product-avatar">
                    {product.name.slice(0, 1).toUpperCase()}
                  </div>

                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.id}</span>
                  </div>
                </div>
              </td>

              <td>
                <span className="category-pill">
                  {product.category}
                </span>
              </td>

              <td>
                <strong>
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </strong>
              </td>

              <td>{product.stock}</td>

              <td>
                <StockBadge stock={product.stock} />
              </td>

              <td>
                <div className="row-actions">
                  <button
                    title="View product"
                    onClick={() => onView(product)}
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    title="Edit product"
                    onClick={() => onEdit(product)}
                  >
                    <Edit3 size={16} />
                  </button>

                  <button
                    title="Delete product"
                    className="delete-action"
                    onClick={() => onDelete(product.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StockBadge({ stock }) {
  if (stock === 0) {
    return (
      <span className="status-badge out">
        Out of stock
      </span>
    );
  }

  if (stock <= 10) {
    return (
      <span className="status-badge low">
        Low stock
      </span>
    );
  }

  return (
    <span className="status-badge in">
      In stock
    </span>
  );
}

function ProductForm({ product, onClose, onSave }) {
  const [form, setForm] = useState(
    product
      ? {
          name: product.name,
          category: product.category,
          price: String(product.price),
          stock: String(product.stock),
          description: product.description
        }
      : emptyForm
  );

  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));

    setErrors((current) => ({
      ...current,
      [field]: ""
    }));
  }

  function validate() {
    const next = {};

    if (!form.name.trim()) {
      next.name = "Product name is required.";
    } else if (form.name.trim().length < 2) {
      next.name = "Name must contain at least 2 characters.";
    }

    if (!form.category.trim()) {
      next.category = "Category is required.";
    }

    if (form.price === "" || Number(form.price) <= 0) {
      next.price = "Enter a price greater than 0.";
    }

    if (
      form.stock === "" ||
      !Number.isInteger(Number(form.stock)) ||
      Number(form.stock) < 0
    ) {
      next.stock = "Stock must be a whole number 0 or greater.";
    }

    if (!form.description.trim()) {
      next.description = "Description is required.";
    } else if (form.description.trim().length < 10) {
      next.description =
        "Description must contain at least 10 characters.";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  }

  function submit(e) {
    e.preventDefault();

    if (!validate()) return;

    onSave({
      ...(product || {}),
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      description: form.description.trim()
    });
  }

  return (
    <Modal
      title={product ? "Edit Product" : "Add Product"}
      onClose={onClose}
    >
      <form
        onSubmit={submit}
        className="product-form"
        noValidate
      >
        <div className="form-grid">
          <Field
            label="Product name"
            error={errors.name}
          >
            <input
              value={form.name}
              onChange={(e) =>
                update("name", e.target.value)
              }
              placeholder="e.g. Wireless Keyboard"
            />
          </Field>

          <Field
            label="Category"
            error={errors.category}
          >
            <input
              value={form.category}
              onChange={(e) =>
                update("category", e.target.value)
              }
              placeholder="e.g. Electronics"
            />
          </Field>

          <Field
            label="Price (₹)"
            error={errors.price}
          >
            <div className="input-with-icon">
              <IndianRupee size={16} />

              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  update("price", e.target.value)
                }
                placeholder="0.00"
              />
            </div>
          </Field>

          <Field
            label="Stock quantity"
            error={errors.stock}
          >
            <input
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={(e) =>
                update("stock", e.target.value)
              }
              placeholder="0"
            />
          </Field>
        </div>

        <Field
          label="Description"
          error={errors.description}
        >
          <textarea
            rows="4"
            value={form.description}
            onChange={(e) =>
              update("description", e.target.value)
            }
            placeholder="Describe the product..."
          />
        </Field>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-btn"
          >
            {product
              ? "Save Changes"
              : "Create Product"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="field">
      <span>{label}</span>

      {children}

      {error && (
        <small className="field-error">
          {error}
        </small>
      )}
    </label>
  );
}
function ProductDetails({ product, onClose, onEdit }) {
  return (
    <Modal
      title="Product Details"
      onClose={onClose}
    >
      <div className="details">
        <div className="detail-hero">
          <div className="detail-avatar">
            {product.name.slice(0, 1).toUpperCase()}
          </div>

          <div>
            <span className="category-pill">
              {product.category}
            </span>

            <h2>{product.name}</h2>

            <p>{product.id}</p>
          </div>
        </div>

        <div className="detail-grid">
          <div>
            <span>Price</span>

            <strong>
              ₹{Number(product.price).toLocaleString("en-IN")}
            </strong>
          </div>

          <div>
            <span>Stock quantity</span>

            <strong>{product.stock}</strong>
          </div>

          <div>
            <span>Status</span>

            <StockBadge stock={product.stock} />
          </div>
        </div>

        <div className="description-box">
          <span>Description</span>

          <p>{product.description}</p>
        </div>

        <div className="form-actions">
          <button
            className="secondary-btn"
            onClick={onClose}
          >
            Close
          </button>

          <button
            className="primary-btn"
            onClick={onEdit}
          >
            <Edit3 size={16} />
            Edit Product
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Modal({
  title,
  onClose,
  children
}) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>

          <button
            className="icon-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function createId() {
  return `P-${Date.now().toString().slice(-6)}`;
}

export default App;