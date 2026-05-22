const Input = ({ label, type = 'text', name, value, onChange, placeholder, error, disabled }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all duration-200
          ${error
            ? 'border-red-500 focus:ring-2 focus:ring-red-300 bg-red-50'
            : 'border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 bg-white'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}
        `}
      />
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;