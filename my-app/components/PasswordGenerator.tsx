'use client'

import { useState } from 'react'

interface AlphabetOptions {
    uppercase: boolean;
    lowercase: boolean;
    digits: boolean;
    special1: boolean;
    special2: boolean;
}

export default function PasswordGenerator() {
    const [alphabetOptions, setAlphabetOptions] = useState<AlphabetOptions>({
        uppercase: true,
        lowercase: true,
        digits: true,
        special1: true,
        special2: false,
    })

    const [passwordLength, setPasswordLength] = useState(6)
    const [passwordCount, setPasswordCount] = useState(5)
    const [passwords, setPasswords] = useState<string[]>([])
    const [strengthResult, setStrengthResult] = useState<{
        alphabetSize: number;
        totalCombinations: number;
        actualProbability: number;
        requiredProbability: number;
        meetsRequirements: boolean;
    } | null>(null)

    const handleOptionChange = (option: keyof AlphabetOptions) => {
        setAlphabetOptions(prev => ({
            ...prev,
            [option]: !prev[option]
        }))
    }

    const generateAlphabet = (): string[] => {
        const alphabet: string[] = []

        if (alphabetOptions.uppercase) {
            alphabet.push(...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)))
        }

        if (alphabetOptions.lowercase) {
            alphabet.push(...Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)))
        }

        if (alphabetOptions.digits) {
            alphabet.push(...Array.from({ length: 10 }, (_, i) => String.fromCharCode(48 + i)))
        }

        if (alphabetOptions.special1) {
            alphabet.push(...['!', '#', '$', '%', '&'])
        }

        if (alphabetOptions.special2) {
            alphabet.push(...['(', ')', '"', "'"])
        }

        return alphabet
    }

    const calculateStrength = (alphabetSize: number, length: number) => {
        const V = 100;
        const T = 10;
        const P_required = 10 ** -7;

        const totalCombinations = Math.pow(alphabetSize, length);
        const actualProbability = (V * T) / totalCombinations;
        const meetsRequirements = actualProbability <= P_required;

        return {
            alphabetSize,
            totalCombinations,
            actualProbability,
            requiredProbability: P_required,
            meetsRequirements
        };
    }

    const generatePasswords = () => {
        const alphabet = generateAlphabet()
        if (alphabet.length === 0) {
            alert('Выберите хотя бы одну группу символов!')
            return
        }

        const newPasswords: string[] = []
        for (let i = 0; i < passwordCount; i++) {
            let password = ''
            for (let j = 0; j < passwordLength; j++) {
                const randomIndex = Math.floor(Math.random() * alphabet.length)
                password += alphabet[randomIndex]
            }
            newPasswords.push(password)
        }

        const strength = calculateStrength(alphabet.length, passwordLength)

        setPasswords(newPasswords)
        setStrengthResult(strength)
    }

    const alphabetSize = generateAlphabet().length

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Генератор паролей - Вариант 12
                    </h1>
                    <p className="text-gray-600">
                        Лабораторная работа по стойкости парольной защиты
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Параметры генерации</h2>

                        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-semibold mb-2">Параметры варианта 12:</h3>
                            <div className="text-sm text-gray-700">
                                <p>Вероятность подбора (P): 10⁻⁷</p>
                                <p>Скорость перебора (V): 100 паролей/день</p>
                                <p>Срок действия (T): 10 дней</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">Выбор алфавита:</h3>
                            <div className="space-y-2">
                                {[
                                    { key: 'uppercase', label: 'Прописные латинские (A-Z) - 26 символов' },
                                    { key: 'lowercase', label: 'Строчные латинские (a-z) - 26 символов' },
                                    { key: 'digits', label: 'Цифры (0-9) - 10 символов' },
                                    { key: 'special1', label: 'Спецсимволы (! # $ % &) - 5 символов' },
                                    { key: 'special2', label: 'Доп. спецсимволы (( ) " \') - 4 символа' },
                                ].map(({ key, label }) => (
                                    <label key={key} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={alphabetOptions[key as keyof AlphabetOptions]}
                                            onChange={() => handleOptionChange(key as keyof AlphabetOptions)}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm">{label}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                                Мощность алфавита: <strong>{alphabetSize}</strong> символов
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Длина пароля:
                                </label>
                                <input
                                    type="number"
                                    min="4"
                                    max="20"
                                    value={passwordLength}
                                    onChange={(e) => setPasswordLength(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Количество паролей:
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={passwordCount}
                                    onChange={(e) => setPasswordCount(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <button
                            onClick={generatePasswords}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                            Сгенерировать пароли
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Результаты</h2>

                        {strengthResult && (
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold mb-3">Расчет стойкости:</h3>
                                <div className="text-sm space-y-1">
                                    <p>Мощность алфавита: <strong>{strengthResult.alphabetSize}</strong></p>
                                    <p>Длина пароля: <strong>{passwordLength}</strong></p>
                                    <p>Общее количество паролей: <strong>{strengthResult.totalCombinations.toLocaleString()}</strong></p>
                                    <p>Фактическая вероятность подбора: <strong>{strengthResult.actualProbability.toExponential(2)}</strong></p>
                                    <p>Требуемая вероятность подбора: <strong>{strengthResult.requiredProbability.toExponential(2)}</strong></p>
                                    <div className={`mt-2 p-2 rounded ${
                                        strengthResult.meetsRequirements
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {strengthResult.meetsRequirements ? (
                                            <span>✓ Требования по стойкости ВЫПОЛНЕНЫ</span>
                                        ) : (
                                            <span>✗ Требования по стойкости НЕ ВЫПОЛНЕНЫ</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Сгенерированные пароли */}
                        {passwords.length > 0 && (
                            <div>
                                <h3 className="font-semibold mb-3">Сгенерированные пароли:</h3>
                                <div className="space-y-2">
                                    {passwords.map((password, index) => (
                                        <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded border">
                                            <span className="font-mono text-lg">{password}</span>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(password)}
                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                Копировать
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}