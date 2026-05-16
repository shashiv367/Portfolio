import { useState } from "react";
import { CONTACT } from "../constants";
import { motion } from "framer-motion";

const DEFAULT_MESSAGE =
  "Hi Shashi, I came across your portfolio and would like to connect regarding a potential opportunity.";

const API_URL = import.meta.env.VITE_API_URL || "";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: DEFAULT_MESSAGE,
  });
  const [status, setStatus] = useState({ type: "idle", text: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: "idle", text: "" });

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const apiDown = res.status === 502 || res.status === 503;
        throw new Error(
          data.error ||
            (apiDown
              ? "API server is not running. Run npm run dev and wait for: API ready → http://localhost:5000"
              : "Failed to send message.")
        );
      }

      setStatus({
        type: data.emailsSent === false ? "error" : "success",
        text: data.message || "Message sent successfully!",
      });
      setForm({ name: "", email: "", message: DEFAULT_MESSAGE });
    } catch (err) {
      const networkError =
        err.message === "Failed to fetch" || err.name === "TypeError";
      setStatus({
        type: "error",
        text: networkError
          ? "Could not reach the API. Run npm run dev and wait for: API ready → http://localhost:5000"
          : err.message ||
            "Could not reach the API. Run npm run dev and wait for both servers to start.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="scroll-mt-24 border-t border-stone-900 pb-16 pt-10">
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5 }}
        className="my-10 text-center text-4xl"
      >
        Get in Touch
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.6 }}
        className="glass-card mx-auto max-w-xl space-y-5 p-8"
      >
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-stone-300">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-stone-200 placeholder-stone-500 outline-none transition focus:border-white/25 focus:ring-1 focus:ring-white/20"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-stone-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-stone-200 placeholder-stone-500 outline-none transition focus:border-white/25 focus:ring-1 focus:ring-white/20"
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-medium text-stone-300">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={form.message}
            onChange={handleChange}
            className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-stone-200 placeholder-stone-500 outline-none transition focus:border-white/25 focus:ring-1 focus:ring-white/20"
          />
        </div>

        {status.text && (
          <p
            className={`text-center text-sm ${
              status.type === "success" ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {status.text}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-white py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Contact Me"}
        </button>
      </motion.form>

      <motion.p
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10 text-center text-lg tracking-tight text-stone-400"
      >
        {CONTACT.phoneNo}
      </motion.p>
      <motion.p
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10 text-center text-lg tracking-tight text-stone-400"
      >
        {CONTACT.email}
      </motion.p>
    </section>
  );
};

export default Contact;
