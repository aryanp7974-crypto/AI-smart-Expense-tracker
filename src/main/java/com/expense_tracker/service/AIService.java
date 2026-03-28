package com.expense_tracker.service;

import com.expense_tracker.model.Expense;
import com.expense_tracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class AIService {

    private final ExpenseRepository expenseRepository;
    private final RestTemplate restTemplate;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    public AIService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
        this.restTemplate = new RestTemplate();
    }

    public String answerQuery(String question) {
        if (question == null || question.isBlank()) {
            return "Please ask a valid question.";
        }

        List<Expense> expenses = expenseRepository.findAll();

        if (expenses.isEmpty()) {
            return "No expense data available.";
        }

        return askGemini(question, expenses);
    }

    public String askGemini(String question, List<Expense> expenses) {
        try {
            // Build context prompt
            StringBuilder context = new StringBuilder();
            context.append("You are a smart expense tracking assistant. ");
            context.append("Here are the user's expenses:\n");

            for (Expense e : expenses) {
                context.append("- ")
                        .append(e.getCategory())
                        .append(": ₹")
                        .append(e.getAmount())
                        .append("\n");
            }

            context.append("\nAnswer this question: ").append(question);

            // Build JSON request body as String
            String requestBody = "{"
                    + "\"contents\": [{"
                    + "\"parts\": [{"
                    + "\"text\": \"" + context.toString().replace("\"", "'") + "\""
                    + "}]"
                    + "}]"
                    + "}";

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            // Call Gemini API
            String url = apiUrl + "?key=" + apiKey;
            ResponseEntity<Map> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            // Parse response
            Map body = response.getBody();
            if (body != null && body.containsKey("candidates")) {
                List candidates = (List) body.get("candidates");
                if (!candidates.isEmpty()) {
                    Map candidate = (Map) candidates.get(0);
                    Map content = (Map) candidate.get("content");
                    List parts = (List) content.get("parts");
                    Map part = (Map) parts.get(0);
                    return (String) part.get("text");
                }
            }

            return "Sorry, Gemini did not return a response.";

        } catch (Exception e) {
            return "Error calling Gemini API: " + e.getMessage();
        }
    }
}