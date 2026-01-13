export const QuickStartsGrid = ({ quickStartsData, featuredIds = [] }) => {
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
      return saved ? JSON.parse(saved) : ['All'];
    }
    return ['All'];
  });

  const [selectedProducts, setSelectedProducts] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quickstarts-products');
      return saved ? JSON.parse(saved) : ['All'];
    }
    return ['All'];
  });

  const [selectedLevels, setSelectedLevels] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quickstarts-levels');
      return saved ? JSON.parse(saved) : ['All'];
    }
    return ['All'];
  });

  const [useCasesDropdownOpen, setUseCasesDropdownOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [levelsDropdownOpen, setLevelsDropdownOpen] = useState(false);

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quickstarts-levels', JSON.stringify(selectedLevels));
    }
  }, [selectedLevels]);

  // Available filter options
  const useCaseOptions = ['All', 'Real-time analytics', 'Data warehousing', 'Observability', 'AI/ML'];
  const productOptions = ['All', 'Self-managed', 'Cloud', 'ClickPipes', 'Language clients', 'ClickStack', 'chDB'];
  const levelOptions = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Toggle functions
  const toggleUseCase = (useCase) => {
    setSelectedUseCases(prev => {
      if (useCase === 'All') {
        // If "All" is clicked, set to only "All" and clear other selections
        return ['All'];
      } else {
        // If any other option is clicked, remove "All" and toggle the option
        const withoutAll = prev.filter(uc => uc !== 'All');
        return withoutAll.includes(useCase)
          ? withoutAll.filter(uc => uc !== useCase)
          : [...withoutAll, useCase];
      }
    });
  };

  const toggleProduct = (product) => {
    setSelectedProducts(prev => {
      if (product === 'All') {
        // If "All" is clicked, set to only "All" and clear other selections
        return ['All'];
      } else {
        // If any other option is clicked, remove "All" and toggle the option
        const withoutAll = prev.filter(p => p !== 'All');
        return withoutAll.includes(product)
          ? withoutAll.filter(p => p !== product)
          : [...withoutAll, product];
      }
    });
  };

  const toggleLevel = (level) => {
    setSelectedLevels(prev => {
      if (level === 'All') {
        // If "All" is clicked, set to only "All" and clear other selections
        return ['All'];
      } else {
        // If any other option is clicked, remove "All" and toggle the option
        const withoutAll = prev.filter(l => l !== 'All');
        return withoutAll.includes(level)
          ? withoutAll.filter(l => l !== level)
          : [...withoutAll, level];
      }
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedUseCases(['All']);
    setSelectedProducts(['All']);
    setSelectedLevels(['All']);
  };

  const hasActiveFilters = searchTerm !== '' ||
    (selectedUseCases.length > 0 && !selectedUseCases.includes('All')) ||
    (selectedProducts.length > 0 && !selectedProducts.includes('All')) ||
    (selectedLevels.length > 0 && !selectedLevels.includes('All'));

  // Filtering logic
  const filteredQuickStarts = useMemo(() => {
    return quickStartsData.filter(quickStart => {
      // Search filter
      const matchesSearch = searchTerm === '' ||
        quickStart.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quickStart.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Use cases filter (OR logic) - "All" means no filter
      const matchesUseCases = selectedUseCases.length === 0 ||
        selectedUseCases.includes('All') ||
        selectedUseCases.some(uc => quickStart.useCases.includes(uc));

      // Products filter (OR logic) - "All" means no filter
      const matchesProducts = selectedProducts.length === 0 ||
        selectedProducts.includes('All') ||
        selectedProducts.some(p => quickStart.products.includes(p));

      // Level filter - "All" means no filter
      const matchesLevel = selectedLevels.length === 0 ||
        selectedLevels.includes('All') ||
        (quickStart.level && selectedLevels.includes(quickStart.level));

      return matchesSearch && matchesUseCases && matchesProducts && matchesLevel;
    });
  }, [quickStartsData, searchTerm, selectedUseCases, selectedProducts, selectedLevels]);

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

    const displayLabel = selectedOptions.length > 0 && !selectedOptions.includes('All')
      ? `${label} (${selectedOptions.length})`
      : label;

    return (
      <div ref={dropdownRef} className="relative" style={{ minWidth: '160px' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`text-sm font-medium rounded-lg transition-all cursor-pointer flex items-center justify-between w-full border ${
            selectedOptions.length > 0 && !selectedOptions.includes('All')
              ? 'bg-black dark:bg-[#FAFF69] text-white dark:text-black border-black dark:border-[#FAFF69]'
              : 'bg-white dark:bg-[#1B1B18] text-black dark:text-white border-gray-300 dark:border-white/20 hover:border-[#FAFF69]'
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
          <div className="absolute z-50 mt-2 w-full rounded-lg shadow-lg border bg-white dark:bg-[#1B1B18] border-gray-200 dark:border-white/20 max-h-[300px] overflow-y-auto">
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


  // Get featured quick starts based on featuredIds
  const featuredQuickStarts = quickStartsData.filter(qs => featuredIds.includes(qs.id));

  return (
    <>
      <div className="max-w-7xl mx-auto px-4">
        {/* Main content area with sidebar */}
        <div className="flex flex-col lg:flex-row gap-8 my-8">
          {/* Left sidebar - Search and filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-4 space-y-6">
              {/* Search input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-zinc-50 mb-3">
                  Search
                </label>
                <div className="relative w-full">
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
                    placeholder="Search quickstarts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-sm border rounded-xl focus:outline-none bg-white dark:bg-[#1B1B18] text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-gray-400 dark:focus:border-[#FAFF69]"
                    style={{
                      height: '42px',
                      padding: '0.5rem 0.75rem 0.5rem 2.75rem',
                      lineHeight: '1.4',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Filters */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-zinc-50 mb-3">
                  Filters
                </label>
                <div className="space-y-3">
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
                  <Dropdown
                    label="Level"
                    options={levelOptions}
                    selectedOptions={selectedLevels}
                    onToggle={toggleLevel}
                    isOpen={levelsDropdownOpen}
                    setIsOpen={setLevelsDropdownOpen}
                  />
                </div>
              </div>

              {/* Reset button */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="w-full text-sm font-medium px-4 py-2 rounded-lg transition-all cursor-pointer border border-gray-300 dark:border-white/20 hover:border-[#FAFF69] bg-white dark:bg-[#1B1B18] text-black dark:text-white"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {/* Right content area */}
          <div className="flex-1">
            {/* Featured quickstarts section */}
            {featuredQuickStarts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-zinc-50 mb-6">Featured</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredQuickStarts.map(quickStart => (
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
              </div>
            )}

            {/* Explore quickstarts section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-zinc-50 mb-6">Explore quickstarts</h2>
              {filteredQuickStarts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="text-center py-12 flex flex-col items-center">
                  <p className="text-gray-600 dark:text-gray-400 text-lg block">
                    No quickstarts found matching your criteria.
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm mt-2 block">
                    Try adjusting your filters or search term.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
