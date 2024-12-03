"use client";

import { useEffect, useState, useMemo } from "react";
import { formatPhoneNumber } from "@/utils/formatters";

interface Advocate {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
}

type SortField =
  | "firstName"
  | "lastName"
  | "city"
  | "degree"
  | "yearsOfExperience";
type SortDirection = "asc" | "desc";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [sortField, setSortField] = useState<SortField>("firstName");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/advocates")
      .then((response) => response.json())
      .then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;

    const filteredAdvocates = advocates.filter((advocate) => {
      const searchTermLower = newSearchTerm.toLowerCase();
      return (
        advocate.firstName.toLowerCase().includes(searchTermLower) ||
        advocate.lastName.toLowerCase().includes(searchTermLower) ||
        advocate.city.toLowerCase().includes(searchTermLower) ||
        advocate.degree.toLowerCase().includes(searchTermLower) ||
        advocate.specialties.some((specialty) =>
          specialty.toLowerCase().includes(searchTermLower)
        )
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    setFilteredAdvocates(advocates);
  };

  const sortedAdvocates = useMemo(() => {
    return [...filteredAdvocates].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      const sortVal = sortDirection === "asc" ? 1 : -1;

      if (sortField === "yearsOfExperience") {
        return (Number(aValue) - Number(bValue)) * sortVal;
      }

      return String(aValue).localeCompare(String(bValue)) * sortVal;
    });
  }, [filteredAdvocates, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-mollieGlaston text-solaceGreen mb-8">
        Solace Associates
      </h1>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Search Advocates
        </h2>
        <div className="flex gap-4">
          <input
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-solaceGreen focus:border-transparent"
            onChange={onChange}
            placeholder="Search by name, city, degree, or specialty..."
          />
          <button
            onClick={onClick}
            className="bg-solaceGreen text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
          >
            Reset Search
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { label: "First Name", field: "firstName" },
                  { label: "Last Name", field: "lastName" },
                  { label: "City", field: "city" },
                  { label: "Degree", field: "degree" },
                  { label: "Specialties", field: null },
                  { label: "Years of Experience", field: "yearsOfExperience" },
                  { label: "Phone Number", field: null },
                ].map(({ label, field }) => (
                  <th
                    key={label}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      field ? "cursor-pointer hover:text-gray-700" : ""
                    }`}
                    onClick={() => field && handleSort(field as SortField)}
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      {field && field === sortField && (
                        <span className="text-gray-900">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAdvocates.map((advocate) => (
                <tr key={advocate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {advocate.firstName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {advocate.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {advocate.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {advocate.degree}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex flex-wrap gap-1">
                      {advocate.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {advocate.yearsOfExperience}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <a
                      href={`tel:${advocate.phoneNumber}`}
                      className="text-solaceGreen hover:text-opacity-80 transition-colors flex items-center gap-1 group"
                    >
                      {formatPhoneNumber(advocate.phoneNumber)}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
