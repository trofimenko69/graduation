export default {
    activateEmail: {
        subject: 'activate code',
        template: code=> `<h1>
            Здравствуйте, для завершения регистрации на сервисе введите полученный код.
            <p>${code}</p>
        </h1>`
    },
    registration: {
        subject: 'Practice registration',
        template: (login, password) =>
            `<h1>Поздравляем! Регистрация на платформе <a href="${process.env.WEB_URL}"></a> завершена!</h1>
        <p>Для входа в систему используйте логин "${login}", пароль "${password}".</p>`
    },

    reminderSubscription: {
        subject: 'subscription expires',
        template: (company)=>
        `<p>Здравствуйте, ваш обонемент в "${company}" скоро закончится.</p>`
    },

    resetPassword: {
        subject:'reset code',
        template: code=> `<h1>
            Здравствуйте, для восстановления пароля введите полученный код.
            <p>${code}</p>
        </h1>`
    }
}