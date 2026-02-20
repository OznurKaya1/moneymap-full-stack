import React from 'react'

export default function SavingGoalsCard() {
    return (
        <div className='main-content'>
            <p>Saving money doesn’t have to be stressful. Define your goals, track your progress,
                and take small steps every month to reach them.</p>
            <ol>
                <li>
                    Set clear goals – Decide exactly what you’re saving for and by when. Short-term
                    goals might be weeks or months; long-term goals can be years.
                </li>
                <li>
                    Pay yourself first – Treat your savings like a non-negotiable expense. Set aside a fixed amount each month before spending on anything else.
                </li>
                <li>
                    Track your spending – Know where your money goes and cut back on unnecessary expenses to free up more for savings.
                </li>
                <li>
                    Break it down – Divide large goals into smaller, achievable milestones. Celebrate each milestone to stay motivated.
                </li>
                <li>
                    Look for extra income – Any bonuses, gifts, or side hustle earnings can go directly into your savings goals.
                </li>
                <li>
                    Review and adjust – Regularly check your progress and adjust contributions if needed to stay on track.
                </li>
                <li>
                    Stay motivated – Visual reminders, charts, or apps that show progress can keep you inspired to save consistently.
                </li>
            </ol>
            <div className='saving-goals-buttons'>
                <button className='bof-button' onClick={() => window.open('https://bettermoneyhabits.bankofamerica.com/', '_blank')}>
                    View Practical Tips
                </button>
                <button className='youtube-button' onClick={() => window.open('https://www.youtube.com/thefinancialdiet')}>
                    Learn How to Save Smarter
                </button>
            </div>
        </div>
    )
}