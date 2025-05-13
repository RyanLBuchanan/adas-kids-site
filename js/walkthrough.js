document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("walkthrough-content");

  // Example: integral ∫ x² dx
  container.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">Example: ∫ x² dx</h2>

    <div class="mb-6">
      <img
        src="/assets/diagrams/integral-diagram.png"
        alt="Diagram of x squared area"
        class="w-4/5 sm:w-2/3 md:w-1/2 lg:w-1/3 mx-auto rounded-lg shadow-lg"
        />
    </div>

    <div class="callout">
      <strong>Step 1:</strong> Identify the form.  
      Here we have ∫ x² dx.
    </div>

    <p class="mb-4">
      The power rule says: <code class="bg-slate-800 px-1 py-0.5 rounded">∫ xⁿ dx = xⁿ⁺¹⁄(n+1) + C</code>.
      So with n=2 → x³/3 + C.
    </p>

    <div class="callout">
      <strong>Step 2:</strong> Apply n = 2 → <code>x³/3 + C</code>.
    </div>

    <p class="mb-4">
      That’s the final answer. We’ve “walked through” each part, used a diagram,
      and highlighted the rule callout above.
    </p>

    <div class="text-center mt-8">
      <button
        id="next-problem"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow"
      >
        Next Example →
      </button>
    </div>
  `;

  // example: bind "Next Example" to rotate through problems
  document.getElementById("next-problem").addEventListener("click", () => {
    container.innerHTML = `
      <h2 class="text-2xl font-bold mb-4">Example: ∫ sin(x) dx</h2>
      <div class="callout">
        <strong>Step 1:</strong> Recognize integral of sin(x) is −cos(x) + C.
      </div>
      <p class="mb-4"><code>−cos(x) + C</code></p>
    `;
  });
});
