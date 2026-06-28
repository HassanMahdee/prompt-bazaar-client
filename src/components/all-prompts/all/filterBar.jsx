import { FaFilter } from "react-icons/fa";
import { useMemo } from "react";

export default function FilterBar({
  onFilterChange,
  selectedCategory,
  selectedDifficulty,
  selectedAiTool,
  prompts,
}) {
  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      prompts.map((p) => p.category).filter(Boolean),
    );
    return ["All", ...Array.from(uniqueCategories).sort()];
  }, [prompts]);

  const aiTools = useMemo(() => {
    const uniqueTools = new Set(prompts.map((p) => p.aiTool).filter(Boolean));
    return ["All", ...Array.from(uniqueTools).sort()];
  }, [prompts]);

  const difficulties = useMemo(() => {
    const uniqueDifficulties = new Set(
      prompts.map((p) => p.difficultyLevel).filter(Boolean),
    );
    return ["All", ...Array.from(uniqueDifficulties).sort()];
  }, [prompts]);

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-outline">
        <FaFilter className="mr-2" />
        Filters
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-1 w-72 p-4 shadow-lg border border-base-300"
      >
        <li className="menu-title">Category</li>
        {categories.map((cat) => (
          <li key={cat}>
            <label className="cursor-pointer">
              <input
                type="radio"
                name="category"
                className="radio radio-xs radio-primary mr-2"
                checked={selectedCategory === cat}
                onChange={() =>
                  onFilterChange("category", cat === "All" ? "" : cat)
                }
              />
              {cat}
            </label>
          </li>
        ))}

        <li className="menu-title mt-2">AI Tool</li>
        {aiTools.map((tool) => (
          <li key={tool}>
            <label className="cursor-pointer">
              <input
                type="radio"
                name="aiTool"
                className="radio radio-xs radio-primary mr-2"
                checked={selectedAiTool === tool}
                onChange={() =>
                  onFilterChange("aiTool", tool === "All" ? "" : tool)
                }
              />
              {tool}
            </label>
          </li>
        ))}

        <li className="menu-title mt-2">Difficulty Level</li>
        {difficulties.map((diff) => (
          <li key={diff}>
            <label className="cursor-pointer">
              <input
                type="radio"
                name="difficulty"
                className="radio radio-xs radio-primary mr-2"
                checked={selectedDifficulty === diff}
                onChange={() =>
                  onFilterChange("difficulty", diff === "All" ? "" : diff)
                }
              />
              {diff}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
