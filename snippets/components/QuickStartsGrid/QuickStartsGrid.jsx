export const QuickStartsGrid = ({ quickStartsData }) => {
  // State management with localStorage
  const [searchTerm, setSearchTerm] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('quickstarts-search') || '';
    }
    return '';
  });

  const [selectedUseCases, setSelectedUseCases] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quickstarts-usecases');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [selectedProducts, setSelectedProducts] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quickstarts-products');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [useCasesDropdownOpen, setUseCasesDropdownOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quickstarts-search', searchTerm);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quickstarts-usecases', JSON.stringify(selectedUseCases));
    }
  }, [selectedUseCases]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quickstarts-products', JSON.stringify(selectedProducts));
    }
  }, [selectedProducts]);

  // Available filter options
  const useCaseOptions = ['Real-time analytics', 'Data warehousing', 'Observability', 'AI/ML'];
  const productOptions = ['Self-managed', 'Cloud', 'ClickPipes', 'Language clients', 'ClickStack', 'chDB'];

  // Toggle functions
  const toggleUseCase = (useCase) => {
    setSelectedUseCases(prev =>
      prev.includes(useCase)
        ? prev.filter(uc => uc !== useCase)
        : [...prev, useCase]
    );
  };

  const toggleProduct = (product) => {
    setSelectedProducts(prev =>
      prev.includes(product)
        ? prev.filter(p => p !== product)
        : [...prev, product]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedUseCases([]);
    setSelectedProducts([]);
  };

  const hasActiveFilters = searchTerm !== '' || selectedUseCases.length > 0 || selectedProducts.length > 0;

  // Filtering logic
  const filteredQuickStarts = useMemo(() => {
    return quickStartsData.filter(quickStart => {
      // Search filter
      const matchesSearch = searchTerm === '' ||
        quickStart.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quickStart.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Use cases filter (OR logic)
      const matchesUseCases = selectedUseCases.length === 0 ||
        selectedUseCases.some(uc => quickStart.useCases.includes(uc));

      // Products filter (OR logic)
      const matchesProducts = selectedProducts.length === 0 ||
        selectedProducts.some(p => quickStart.products.includes(p));

      return matchesSearch && matchesUseCases && matchesProducts;
    });
  }, [quickStartsData, searchTerm, selectedUseCases, selectedProducts]);

  // Dropdown component
  const Dropdown = ({ label, options, selectedOptions, onToggle, isOpen, setIsOpen }) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, setIsOpen]);

    const displayLabel = selectedOptions.length > 0
      ? `${label} (${selectedOptions.length})`
      : label;

    return (
      <div ref={dropdownRef} className="relative" style={{ minWidth: '160px' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`text-sm font-medium rounded-lg transition-all cursor-pointer flex items-center justify-between w-full border ${
            selectedOptions.length > 0
              ? 'bg-black dark:bg-[#FAFF69] text-white dark:text-black border-black dark:border-[#FAFF69]'
              : 'bg-white dark:bg-[#282828] text-black dark:text-white border-gray-300 dark:border-white/20 hover:border-[#FAFF69]'
          }`}
          style={{ padding: '8px 12px', gap: '8px' }}
        >
          <span>{displayLabel}</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          >
            <path
              d="M2.5 4.5L6 8L9.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute z-50 mt-2 w-full rounded-lg shadow-lg border bg-white dark:bg-[#282828] border-gray-200 dark:border-white/20 max-h-[300px] overflow-y-auto">
            {options.map(option => (
              <label
                key={option}
                className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => onToggle(option)}
                  className="w-4 h-4 cursor-pointer accent-[#FAFF69]"
                />
                <span className="text-sm text-black dark:text-white">
                  {option}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };


  return (
    <>
      <div className="max-w-7xl mx-auto px-4">
        {/* Search input */}
        <div className="my-8 flex items-center" style={{ margin: '2rem 0' }}>
          <div className="relative w-full" style={{ maxWidth: '600px' }}>
            <svg
              className="absolute pointer-events-none z-10"
              style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#666' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search quick starts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm border rounded-xl focus:outline-none bg-[#F6F7FA] dark:bg-[#282828] text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-gray-400 dark:focus:border-[#FAFF69]"
              style={{
                height: '42px',
                padding: '0.5rem 0.75rem 0.5rem 2.75rem',
                lineHeight: '1.4',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Filters and Reset button */}
        <div className="flex flex-wrap items-center gap-3 my-6">
          <Dropdown
            label="Use cases"
            options={useCaseOptions}
            selectedOptions={selectedUseCases}
            onToggle={toggleUseCase}
            isOpen={useCasesDropdownOpen}
            setIsOpen={setUseCasesDropdownOpen}
          />
          <Dropdown
            label="Products"
            options={productOptions}
            selectedOptions={selectedProducts}
            onToggle={toggleProduct}
            isOpen={productsDropdownOpen}
            setIsOpen={setProductsDropdownOpen}
          />
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-sm font-medium px-4 py-2 rounded-lg transition-all cursor-pointer border border-gray-300 dark:border-white/20 hover:border-[#FAFF69] bg-white dark:bg-[#282828] text-black dark:text-white"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Quick-starts grid */}
        {filteredQuickStarts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            {filteredQuickStarts.map(quickStart => (
              <Card
                key={quickStart.id}
                title={quickStart.title}
                icon={quickStart.icon}
                href={quickStart.href}
              >
                {quickStart.description}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg text-center">
              No quick starts found matching your criteria.
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2 text-center">
              Try adjusting your filters or search term.
            </p>
          </div>
        )}
      </div>
    </>
  );
};
