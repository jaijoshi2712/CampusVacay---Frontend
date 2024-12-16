import React, { useState, useEffect } from 'react';
import { Sliders, ChevronDown, ChevronUp } from 'lucide-react';

const FilterSection = ({ searchResults, onFilterChange }) => {
  // Calculate initial price range from the data
  const allPrices = searchResults.flatMap(hotel => 
    hotel.rooms.map(room => room.price_per_night)
  );
  const initialMinPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
  const initialMaxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 1000;

  const [priceRange, setPriceRange] = useState([initialMinPrice, initialMaxPrice]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    facilities: true,
    roomTypes: true
  });

  // Effect to update price range when search results change
  useEffect(() => {
    const newMinPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
    const newMaxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 1000;
    setPriceRange([newMinPrice, newMaxPrice]);
    onFilterChange({
      priceRange: [newMinPrice, newMaxPrice],
      selectedFacilities: [],
      selectedRoomTypes: []
    });
  }, [searchResults]);

  // Extract unique facilities from all hotels
  const allFacilities = [...new Set(
    searchResults.flatMap(hotel => 
      hotel.facilities?.split(',').map(f => f.trim()) || []
    )
  )].filter(Boolean).sort();

  // Extract unique room types
  const allRoomTypes = [...new Set(
    searchResults.flatMap(hotel => 
      hotel.rooms.map(room => room.room_type)
    )
  )].sort();

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePriceChange = (e, bound) => {
    const value = parseInt(e.target.value) || 0;
    setPriceRange(prev => {
      const newRange = bound === 'min' 
        ? [Math.min(value, prev[1]), prev[1]]
        : [prev[0], Math.max(value, prev[0])];
      onFilterChange({ 
        priceRange: newRange, 
        selectedFacilities,
        selectedRoomTypes
      });
      return newRange;
    });
  };

  const handleFacilityChange = (facility) => {
    setSelectedFacilities(prev => {
      const newFacilities = prev.includes(facility)
        ? prev.filter(f => f !== facility)
        : [...prev, facility];
      onFilterChange({ 
        priceRange, 
        selectedFacilities: newFacilities,
        selectedRoomTypes 
      });
      return newFacilities;
    });
  };

  const handleRoomTypeChange = (roomType) => {
    setSelectedRoomTypes(prev => {
      const newRoomTypes = prev.includes(roomType)
        ? prev.filter(r => r !== roomType)
        : [...prev, roomType];
      onFilterChange({ 
        priceRange, 
        selectedFacilities,
        selectedRoomTypes: newRoomTypes 
      });
      return newRoomTypes;
    });
  };

  const FilterSectionWrapper = ({ title, isExpanded, onToggle, children }) => (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={onToggle}
        className="flex justify-between items-center w-full text-left font-semibold text-gray-700 mb-2"
      >
        {title}
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isExpanded && children}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
        <Sliders className="text-blue-600" size={20} />
        <h2 className="text-lg font-semibold">Filters</h2>
      </div>

      <FilterSectionWrapper
        title="Price Range"
        isExpanded={expandedSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Min Price ($)</label>
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(e, 'min')}
              min={initialMinPrice}
              max={priceRange[1]}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Max Price ($)</label>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(e, 'max')}
              min={priceRange[0]}
              max={initialMaxPrice}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      </FilterSectionWrapper>

      <FilterSectionWrapper
        title="Facilities"
        isExpanded={expandedSections.facilities}
        onToggle={() => toggleSection('facilities')}
      >
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {allFacilities.map((facility) => (
            <label key={facility} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedFacilities.includes(facility)}
                onChange={() => handleFacilityChange(facility)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{facility}</span>
            </label>
          ))}
        </div>
      </FilterSectionWrapper>

      <FilterSectionWrapper
        title="Room Types"
        isExpanded={expandedSections.roomTypes}
        onToggle={() => toggleSection('roomTypes')}
      >
        <div className="space-y-2">
          {allRoomTypes.map((roomType) => (
            <label key={roomType} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedRoomTypes.includes(roomType)}
                onChange={() => handleRoomTypeChange(roomType)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{roomType}</span>
            </label>
          ))}
        </div>
      </FilterSectionWrapper>
    </div>
  );
};

// Hook to manage filtered results
const useFilteredResults = (searchResults) => {
  // Calculate initial price range from the actual data
  const allPrices = searchResults.flatMap(hotel => 
    hotel.rooms.map(room => room.price_per_night)
  );
  const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
  const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 1000;

  const [filters, setFilters] = useState({
    priceRange: [minPrice, maxPrice],
    selectedFacilities: [],
    selectedRoomTypes: []
  });

  const filteredResults = searchResults.filter(hotel => {
    // Check if any room's price falls within the range
    const priceInRange = hotel.rooms.some(
      room => room.price_per_night >= filters.priceRange[0] && 
              room.price_per_night <= filters.priceRange[1]
    );

    // Check if hotel has all selected facilities
    const hasFacilities = filters.selectedFacilities.length === 0 || 
      filters.selectedFacilities.every(facility => 
        hotel.facilities?.toLowerCase().includes(facility.toLowerCase())
      );

    // Check if hotel has any of the selected room types
    const hasRoomTypes = filters.selectedRoomTypes.length === 0 ||
      hotel.rooms.some(room =>
        filters.selectedRoomTypes.includes(room.room_type)
      );

    return priceInRange && hasFacilities && hasRoomTypes;
  });

  return { filteredResults, setFilters };
};

export { FilterSection, useFilteredResults };