package com.localservicefinder.repository;

import com.localservicefinder.entity.Notification;
import com.localservicefinder.enums.RecipientType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipientIdAndRecipientType(
            Long recipientId,
            RecipientType recipientType
    );
}